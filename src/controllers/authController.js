import { login } from "../models/Auth";

export const loginUser = async (email, password) => {
    return await login(email, password);
  };