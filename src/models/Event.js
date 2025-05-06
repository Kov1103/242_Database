// src/models/Event.js
import { createClient } from "@supabase/supabase-js";
import { getData, postData } from "../services/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// const API_URL = import.meta.env.VITE_API_URL;

// export const getAllEvents = async () => {
//     const { data, error } = await supabase.from("events").select("*")
//     if (error) throw error
//     return data
// }

export const getAllEvents = async (params = {}) => {
    return getData('/events', params); // Gọi API lấy tất cả sự kiện
  };

  export const updateStatus = async (eventId, status, approverId) => {
    const response = await postData('/events/update', {
      event_id: eventId,
      status: status,
      approver_id: approverId,
    });
    return response
  };

export const getEventById = async (id) => {
    const { data, error } = await supabase.from("events").select().eq("id", id).single()
    if (error) throw error
    return data
}

export const createEvent = async (event) => {
    const { data, error } = await supabase.from("events").insert(event);
    if (error) throw error;
    return data;
}

export const uploadImage = async (file, id_folder, id_image) => {
    const { data, error } = await supabase.storage
      .from("test")
      .upload(id_folder + "/" + id_image, file);
    if (error) throw error;
    return data;
}