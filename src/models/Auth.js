import { postData } from "../services/api";

export const login = async (email, password) => {
    return postData('/auth/login', { email, password }); // Gọi API lấy tất cả sự kiện
  };