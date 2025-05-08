// src/controllers/userController.js
import { getAllUsers, createUser, getUser, updateUser } from "../models/User";
import { getSession } from "../models/Auth";

export const fetchAllUsers = async () => {
  const data = await getAllUsers();
  return data.users;
};

export const changeInfo = async (user, phone_no, address, email) => {
    return await updateUser(user, phone_no, address, email);
  };

// export const addUser = async (user) => {
//   return await createUser(user);
// };

export const fetchUser = async () => {
    const session = await getSession();

    const userEmail = session?.user?.email;
    if (!userEmail) {
      console.warn("No email found in session.");
      return { userData: null, sessionStatus: null };
    }
    
    const user = await getUser(userEmail);

    if (!user) {
        console.warn("No user found with the provided email.");
        return { userData: null, sessionStatus: session };
    }

    return { userData: user, sessionStatus: session };
}

export const addUser = async (user) => {
  await createUser(user);
}
// export const changeInfo = async (user) => {
//   return await updateUser(user)
// }
