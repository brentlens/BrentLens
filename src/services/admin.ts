/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from "@/lib/supabaseClient";
import { IIncident } from "@/lib/types/incidentType";



export const getAdminIncidents = async (): Promise<IIncident[]> => {
  try {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .ilike("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Service error:", error);
    return [];
  }
};

export const getIncidentById = async (
  id: string
): Promise<IIncident | null> => {
  try {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch by ID error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateIncidentStatus = async (
  id: string,
  status: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/review/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    return result.success;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// export async function updateIncidentStatus(
//   incidentId: string,
//   status: string
// ) {
//   const { error } = await supabase
//     .from("incidents")
//     .update({
//       status,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", incidentId);

//   if (error) {
//     console.error(error);
//     return false;
//   }

//   return true;
// }