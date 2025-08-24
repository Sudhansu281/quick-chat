import axios from "axios";
export const url = "https://quick-chat-18.onrender.com";
export const axiosInstance = axios.create({
     headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
