import { axiosInstance,url } from "./index";
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

export const uploadProfilePic = async (image) => {
    try{
        const response = await axiosInstance.post('/api/auth/upload-profile-pic', { image });
        return response.data;
    }catch(error){
        return error;
    }
}
