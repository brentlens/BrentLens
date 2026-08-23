/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabaseClient";

type PublishPayload = {
  incident: any;
  formData: any;
  images: File[];
};

const uploadIncidentImages = async (
  incidentId: string,
  images: File[]
) => {
  // If the user didn't pass any new files, we return an empty string 
  // (or you can adjust this if you want an empty array to clear out imagery entirely)
  if (!images.length) return "";

  const uploadedUrls: string[] = [];

  try {
    // -------------------------------------------------------------
    // 1. CLEANUP PREVIOUS IMAGES (DELETE IF FOLDER EXISTS)
    // -------------------------------------------------------------
    const folderPath = `incidents/${incidentId}`;

    // List all files inside the targeted folder path
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("public_incidents")
      .list(folderPath);

    if (listError) {
      console.error("Error checking existing files for cleanup:", listError.message);
      // We don't necessarily want to crash the whole upload if listing fails, 
      // but you can throw here if you prefer strict operations.
    }

    // If files are found inside the folder, execute a bulk removal array mapping
    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((file) => `${folderPath}/${file.name}`);
      
      const { error: deleteError } = await supabase.storage
        .from("public_incidents")
        .remove(filesToDelete);

      if (deleteError) {
        throw new Error(`Failed to clear old assets before re-upload: ${deleteError.message}`);
      }
      console.log(`Cleaned up ${existingFiles.length} old images for incident: ${incidentId}`);
    }

    // -------------------------------------------------------------
    // 2. PROCEED WITH UPLOADING FRESH IMAGES
    // -------------------------------------------------------------
    for (const file of images) {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public_incidents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from("public_incidents")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

  } catch (error: any) {
    console.error("Storage transactional pipeline crashed:", error);
    throw error;
  }

  return uploadedUrls.join(";");
};

export const publishApprovedIncident = async ({
  incident,
  formData,
  images,
}: PublishPayload) => {
  let imageUrls = "";

if (images.length) {
  imageUrls = await uploadIncidentImages(
    incident.id,
    images
  );
}

  const coordinates =
    formData.latitude && formData.longitude
      ? {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude),
        }
      : null;
  // console.log("formData::::::",formData);
  
  const { error } = await supabase
    .from("incidents")
    .update({
      cleanTitle: formData.title,
      incidentType: formData.incidentType,
      date: formData.date,
      state: formData.state,
      country: formData.country,
      community: formData.community,
      verificationStatus: formData.verificationStatus,
      location: formData.specificLocation,
      shortSummary: formData.summary,
      fullContent: formData.fullContent,
      originalLink: formData.primarySource,
      locationConfidence: formData.aiConfidence,
      source: formData.source,
      publisher: formData.source,
      coordinates,
      status: "PUBLISHED",
      image_url: imageUrls,
      publishedAt: new Date().toISOString(),
      updatedOn: new Date().toISOString()
    })
    .eq("id", incident.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
export const createNewIncident = async ({
  formData,
  images,
}: Omit<PublishPayload, "incident"> & { incident?: any }) => {
  
  const coordinates =
    formData.latitude && formData.longitude
      ? {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude),
        }
      : null;

  // STEP 1: Insert the textual data first without images to generate the record ID
  const { data: newIncident, error: insertError } = await supabase
    .from("incidents")
    .insert({
      cleanTitle: formData.title,
      incidentType: formData.incidentType,
      date: formData.date,
      state: formData.state,
      country: formData.country,
      community: formData.community,
      verificationStatus: formData.verificationStatus,
      location: formData.specificLocation,
      shortSummary: formData.summary,
      fullContent: formData.fullContent,
      originalLink: formData.primarySource,
      locationConfidence: formData.aiConfidence,
      source: formData.source,
      publisher: formData.source,
      coordinates,
      status: "PUBLISHED",
      image_url: "", // Temporary empty string placeholder
      publishedAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    })
    .select("id") // Only ask for the newly generated ID back
    .single();

  if (insertError || !newIncident) {
    throw new Error(insertError?.message || "Failed to insert record into Supabase");
  }

  // STEP 2: If images exist, pass the newly generated ID to the storage uploader
  if (images && images.length > 0) {
    try {
      const imageUrls = await uploadIncidentImages(newIncident.id, images);

      if (imageUrls) {
        // STEP 3: Update the record with the fresh asset destination path string
        const { error: updateError } = await supabase
          .from("incidents")
          .update({
            image_url: imageUrls,
            updatedOn: new Date().toISOString()
          })
          .eq("id", newIncident.id);

        if (updateError) {
          throw new Error(`Text saved, but failed updating media references: ${updateError.message}`);
        }
      }
    } catch (uploadError: any) {
      throw new Error(`Incident document entry compiled, storage transaction interrupted: ${uploadError.message}`);
    }
  }

  return true;
};