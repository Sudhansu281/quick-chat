import { axiosInstance,url } from './index';
export const signupUser = async (user) => {
    try{
        const response = await axiosInstance.post('/user/signup',user);
        return response.data;
    }catch(error){
        return error;
    }
}

export const loginUser = async (user) => {
    try{
        const response = await axiosInstance.post('/user/login',user);
        return response.data;
    }catch(error){
        return error;
    }
}
