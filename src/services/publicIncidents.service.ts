import { supabase } from "@/lib/supabaseClient";
import { IIncidentList, IPublicForm, IPublicFormList } from "@/lib/types/CustomTypes";

export const addPublicIncident = async (obj: IPublicForm) => {

    const file = obj.file as File;

    if (!file) {
        return Response.json({ error: "No file" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { data: filedata, error: fileerror } = await supabase.storage
        .from("public_incidents")
        .upload(fileName, file, {
            contentType: file.type,
        });

    if (fileerror) {
        console.error(fileerror);
        return Response.json({ error: fileerror.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from("public_incidents")
        .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    let formData = {
        title: obj.title,
        date_of_incident: obj.doi,
        location: obj.location,
        community: obj.community,
        source_url: obj.sourceURL,
        email: obj.email,
        description: obj.description,
        file_url: fileUrl,
    }

    const { data, error } = await supabase
        .from('public_record_incidents')
        .insert(formData)

    if (error) {
        console.error(error)
    } else {
        console.log('Inserted:', data)
    }
    return 1
};


// export const getIncidentById = async (id: string) => {
//     const { data, error } = await supabase
//         .from('incidents')
//         .select('*').eq('id', id)

//     if (error) {
//         console.error(error)
//     } else {
//         // console.log('fetched -------- :', data)
//     }
//     // console.log(data)
//     return data?.map((item: any): IIncidentList => ({
//         id: item.id,
//         cleanTitle: item.cleanTitle,
//         publisher: item.publisher,
//         shortSummary: item.shortSummary,
//         originalLink: item.originalLink,
//         location: item.location,
//         coordinates: item.coordinates,
//         source: item.source,
//         matchedKeyword: item.matchedKeyword,
//         locationConfidence: item.locationConfidence,
//         fullContent: item.fullContent,
//         status: item.status,
//         date: item.date
//     }));
// };


export const getPublicIncidentsList = async () => {
    const { data, error } = await supabase
        .from('public_record_incidents')
        .select('*')
    if (error) {
        console.error(error)
    } else {
        // console.log('fetched -------- :', data)
    }
    // console.log(data)
    return data?.map((item: any): IPublicFormList => ({
        id: item.id,
        title: item.title,
        community: item.community,
        description: item.description,
        doi: item.date_of_incident,
        email: item.email,
        file: item.file_url,
        location: item.location,
        sourceURL: item.source_url
    }));
};