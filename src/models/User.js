// src/models/User.js
import { createClient } from "@supabase/supabase-js";
import { getData, patchData } from "../services/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// export const getAllUsers = async () => {
//   const { data, error } = await supabase.from("users").select("*");
//   if (error) throw error;
//   return data;
// };
export const getAllUsers = async () => {
    return getData('/users'); // Gọi API lấy tất cả sự kiện
  };

export const createUser = async (user) => {
  const { data, error } = await supabase.from("users").insert([user]);
  if (error) throw error;
  return data;
};

export const getUser = async (email) => {
  const { data, error } = await supabase.from("users").select().eq("email", email).single()
  if (error) {
    console.error("Error fetching user:", error)
    return null
  }
  return data
}

export const getSession = () => {
  return supabase.auth.getSession()
}

// export const updateUser = async (user) => {
//   const { data, error } = await supabase.from("users").update(user).eq('id', user.id).single()
//   if (error) throw error
//   return data
// }
export const updateUser = async (user, phone_no, address, email) => {
  const response = await patchData('/users/update', {
    id: user.id,
    ssn: user.ssn,
    email: email,
    password: user.password,
    fname: user.fname,
    lname: user.lname,
    gender: user.gender,
    dob: user.dob,
    phone_no: phone_no,
    address: address,
  }); // Gọi API lấy tất cả sự kiện
  return response
};