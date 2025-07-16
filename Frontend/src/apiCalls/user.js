import { axiosInstance } from "./index";
export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/get-logged-user", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: "Failed to fetch user" };
  }
};

export const getAllUsers = async () => {
    try{
        const response = await axiosInstance.get('/api/auth/get-all-users');
        return response.data;
    }catch(error){
        return error;
    }
}

