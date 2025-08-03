import axios from "axios";
export const url = "http://localhost:8080";
export const axiosInstance = axios.create({
     headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});