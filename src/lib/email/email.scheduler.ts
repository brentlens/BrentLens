
import { EmailTemplate, CampaignMode } from '@/types/email';
import { supabaseAdmin } from '../supabaseAdmin';

export class EmailScheduler {
  /**
   * Calculates the exact future Date for a given delay
   */
  public static calculateNextSendDate(delayValue: number, delayUnit: string, fromDate: Date = new Date()): Date {
    const target = new Date(fromDate.getTime());
    switch (delayUnit) {
      case 'minutes':
        target.setMinutes(target.getMinutes() + delayValue);
        break;
      case 'hours':
        target.setHours(target.getHours() + delayValue);
        break;
      case 'days':
      default:
        target.setDate(target.getDate() + delayValue);
        break;
    }
    return target;
  }

  /**
   * Resolves the next eligible template based on send history and campaign mode
   */
  public static async resolveNextTemplate(params: {
    userId: string;
    campaignId: string;
    mode: CampaignMode;
    restartAfterCompletion: boolean;
  }): Promise<{ template: EmailTemplate | null; isCompleted: boolean }> {
    const { userId, campaignId, mode, restartAfterCompletion } = params;

    // 1. Fetch active templates ordered by sequence
    const { data: templates, error: tErr } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('is_active', true)
      .order('sequence_order', { ascending: true });

      // console.log({
      //   temp: templates,
      //   erro: tErr,
      //   campid: campaignId,
      //   uid:userId
      // })

    if (tErr || !templates || templates.length === 0) {
      return { template: null, isCompleted: true };
    }

    // 2. Fetch templates already successfully sent or currently processing
    const { data: sentLogs, error: lErr } = await supabaseAdmin
      .from('email_delivery_logs')
      .select('template_id')
      .eq('user_id', userId)
      .eq('campaign_id', campaignId)
      .in('status', ['sent', 'processing']);

    if (lErr) throw lErr;

    
    const sentTemplateIds = new Set((sentLogs || []).map((l) => l.template_id));
    const eligibleTemplates = templates.filter((t) => !sentTemplateIds.has(t.id));
    // console.log({
    //     eligibleTemplates: eligibleTemplates,
    //     campid: campaignId,
    //     uid:userId,
    //     sentLogs :sentLogs
    //   })

    // Handle end-of-sequence
    if (eligibleTemplates.length === 0) {
      if (restartAfterCompletion) {
        // Reset sequence: select first template
        return { template: templates[0], isCompleted: false };
      }
      return { template: null, isCompleted: true };
    }

    if (mode === 'sequential') {
      return { template: eligibleTemplates[0], isCompleted: false };
    }

    // Random Mode: deterministic random selection from eligible list
    const randomIndex = Math.floor(Math.random() * eligibleTemplates.length);
    return { template: eligibleTemplates[randomIndex], isCompleted: false };
  }
}