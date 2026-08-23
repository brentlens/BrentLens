import EditIncidentForm from "@/components/admin/review/EditIncidentForm";
import { getIncidentById } from "@/services/admin";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditIncidentPage({ params }: Props) {
  const { id } = await params;

  const incident = await getIncidentById(id);

  if (!incident) {
    notFound();
  }

  return <EditIncidentForm incident={incident} />;
}