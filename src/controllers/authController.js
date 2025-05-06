import { getSession, login, setSession } from "../models/Auth";

export const loginUser = async (email, password) => {
    return await login(email, password);
  };

export const setUser = async (token) => {
    try {
      return await setSession(token);
    } catch (error) {
      console.error('Lỗi khi lưu session:', error.message);
    }
};

export const getUser = async () => {
    try {
        return await getSession();
      } catch (error) {
        console.error('Lỗi khi lấy session:', error.message);
      }
}