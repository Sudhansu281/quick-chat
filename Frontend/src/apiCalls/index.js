import axios from "axios";
export const url = "https://chat-app-server-hsf9.onrender.com";
export const axiosInstance = axios.create({
     headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});