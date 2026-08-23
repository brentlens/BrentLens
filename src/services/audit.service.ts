/* eslint-disable prefer-const */
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { IAuditLogsModel } from "@/lib/types/CustomTypes";

export const auditLog = async (model:IAuditLogsModel) => {
  const { error: recordError } = await supabaseAdmin.from("audit_logs").insert([
    {
      actionName: model.actionName,
      newsTitle: model.newsTitle,
      newsId: model.newsId,
      editedBy: model.editedBy
    },
  ]);

  if (recordError) {
    console.error("Failed to save audit log record:", recordError.message);
  }

}

export const getAuditLogs = async (page: number, size: number) => {
  const from = (page - 1) * size
  const to = from + size - 1

  const { data:logdata ,error: recordError,count } = await supabaseAdmin.from("audit_logs")
  .select("*",{count: 'exact'})
  .order('created_at',{ascending:false,})
    .range(from, to);

  if (recordError) {
    console.error("Failed to save audit log record:", recordError.message);
    return {
      data: null,
      status: false
    }
  }
  return {
    data: logdata,
    status: true,
     totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / size),
  }
}