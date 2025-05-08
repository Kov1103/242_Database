// src/models/User.js
import { createClient } from "@supabase/supabase-js";
import { getData, patchData, postData } from "../services/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// export const getAllUsers = async () => {
//   const { data, error } = await supabase.from("users").select("*");
//   if (error) throw error;
//   return data;
// };

const formatDob = (dobString) => {
  const date = new Date(dobString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng từ 0-11
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
};

export const getAllUsers = async () => {
    return getData('/users'); // Gọi API lấy tất cả sự kiện
  };

// export const createUser = async (user) => {
//   const { data, error } = await supabase.from("users").insert([user]);
//   if (error) throw error;
//   return data;
// };

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
  console.log(user)
  const response = await patchData('/users/update', {
    id: user.id,
    ssn: user.ssn,
    email: email,
    password: user.password,
    fname: user.fname,
    lname: user.lname,
    gender: user.gender,
    dob: formatDob(user.dob),
    phone_no: phone_no,
    address: address,
  }); // Gọi API lấy tất cả sự kiện
  
  return response
};

export const createUser = async (user) => {
  const response = await postData('/users/create', {
    ssn: user.ssn,
    email: user.email,
    password: user.password,
    fname: user.fname,
    lname: user.lname,
    gender: user.gender,
    dob: formatDob(user.dob),
    phone_no: user.phone_no,
    address: user.address,
  });

  return response;
};
