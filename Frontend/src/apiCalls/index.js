import axios from "axios";
export const url = "https://quick-chat-zmrb.onrender.com";
export const axiosInstance = axios.create({
     headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});
