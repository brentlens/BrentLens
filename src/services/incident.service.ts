/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabaseClient";
import { IIncidentList } from "@/lib/types/CustomTypes";

export const getIncidentById = async (id: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*').eq('id', id)

  if (error) {
    console.error(error)
  } else {
    // console.log('fetched -------- :', data)
  }
  // console.log(data)
  return data?.map((item: any): IIncidentList => ({
    id: item.id,
    cleanTitle: item.cleanTitle,
    publisher: item.publisher,
    shortSummary: item.shortSummary,
    originalLink: item.originalLink,
    location: item.location,
    coordinates: item.coordinates,
    source: item.source,
    matchedKeyword: item.matchedKeyword,
    locationConfidence: item.locationConfidence,
    fullContent: item.fullContent,
    status: item.status,
    date: item.date,
    verificationStatus: item.verificationStatus,
    image_url: item.image_url,
  }));
};
export const getIncidentsList = async (page: number, size: number) => {

  const from = (page - 1) * size
  const to = from + size - 1

  const { data, error, count } = await supabase
    .from('incidents')
    .select('*', { count: 'exact' })
    .neq('verificationStatus',null)
    .range(from, to)

  if (error) {
    console.error(error)
  } else {
    // console.log('fetched =====----========- :', data)
  }
  // console.log(data)
  let dataList = data?.map((item: any): IIncidentList => ({
    id: item.id,
    cleanTitle: item.cleanTitle,
    publisher: item.publisher,
    shortSummary: item.shortSummary,
    originalLink: item.originalLink,
    location: item.location,
    coordinates: item.coordinates,
    source: item.source,
    matchedKeyword: item.matchedKeyword,
    locationConfidence: item.locationConfidence,
    fullContent: item.fullContent,
    status: item.status,
    date: item.date,
    verificationStatus: item.verificationStatus,
    image_url: item.image_url
  }));

  if (error) {
    console.error(error)

    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
    }
  }

  return {
    dataList,
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / size),
  }

};
export const getAllMapIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('id, cleanTitle, shortSummary, location, coordinates, status, date, state, community, incidentType, verificationStatus');

  if (error) {
    console.error("Supabase Map Fetch Error:", error);
    return [];
  }
  return data.map((item: any) => {
    // Safely parse JSON coordinates if stored as a string or raw object
    let coords = item.coordinates;
    if (typeof coords === 'string') {
      try { coords = JSON.parse(coords); } catch { coords = null; }
    }

    // fallback color mapper based on community patterns or status
    const getColorByStatus = (verificationStatus: string) => {
      if (verificationStatus?.toUpperCase() === 'VERIFIED') return '#22C55E'; // Green
      if (verificationStatus?.toUpperCase() === 'REPORTED') return '#EF4444'; // Red
      return '#F97316'; // Orange / Default
    };

    return {
      id: item.id,
      title: item.cleanTitle || "Untitled Incident",
      description: item.shortSummary || "",
      location: item.location || "Unknown Location",
      date: item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Date Unknown",
      verificationStatus: item.verificationStatus || "Reported",
      community: item.community || "",
      state: item.state || "",
      incidentType: item.incidentType || "",
      lat: coords?.lat || coords?.latitude || 0,
      lng: coords?.lng || coords?.longitude || 0,
      color: getColorByStatus(item.status),
    };
  });
};

export const addIncidentByAdmin = async (
  incident: any,
  file: FormDataEntryValue | null
) => {

  let imageUrl = "";
  if (file && file instanceof File) {

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const filePath = `incidents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public_incidents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return null;
    }

    // GET PUBLIC URL
    const { data } = supabase.storage
      .from("public_incidents")
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }
  const payload = {
    ...incident,
    file_url: imageUrl,
  };

  // UPSERT
  const { data, error } = await supabase
    .from("incidents")
    .upsert(payload, {
      onConflict: "id",
    })
    .select();

  if (error) {
    console.error("Supabase Error:", error);
    return null;
  }

  return data;
};

export const getPublishedIncidentsList = async (page: number, size: number) => {

  const from = (page - 1) * size
  const to = from + size - 1

  const { data, error, count } = await supabase
    .from('incidents')
    .select('id, cleanTitle, location,verificationStatus, date,matchedKeyword,shortSummary,originalLink,fullContent', { count: 'exact' })
    .eq('status','PUBLISHED')
    .order('updatedOn',{ascending:false})
    .range(from, to)

  if (error) {
    console.error(error)
  } else {
    // console.log('fetched =====----========- :', data)
  }
  // console.log(data)
  let dataList = data?.map((item: any): IIncidentList => ({
    id: item.id || '',
    cleanTitle: item.cleanTitle|| '',
    publisher: item.publisher || '',
    shortSummary: item.shortSummary || '',
    originalLink: item.originalLink || '',
    location: item.location || '',
    coordinates: item.coordinates || '',
    source: item.source || '',
    matchedKeyword: item.matchedKeyword || '',
    locationConfidence: item.locationConfidence || '',
    fullContent: item.fullContent || '',
    status: item.status || '',
    date: item.date || '',
    verificationStatus: item.verificationStatus,
    image_url: item.image_url
  }));

  if (error) {
    console.error(error)

    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
    }
  }

  return {
    dataList,
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / size),
  }

};

export const getLatestPublishedIncidents = async () => {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("status", "PUBLISHED")
	.eq("verificationStatus", "Verified")
    .order("publishedAt", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching latest incidents:", error);
    return [];
  }

  return data || [];
};

// const res = await axiosInstance.get(`/api/incidentsList`);
// return res.data;