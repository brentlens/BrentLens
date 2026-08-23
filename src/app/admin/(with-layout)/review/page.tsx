/* eslint-disable @typescript-eslint/no-explicit-any */

import ReviewQueueClient from "@/components/admin/review/ReviewQueueClient";
import { getAdminIncidents } from "@/services/admin";

export default async function ReviewQueuePage() {
  const reviewItems = await getAdminIncidents();
   return <ReviewQueueClient incidents={reviewItems} />;
}