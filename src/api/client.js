import axios from "axios";

const API = axios.create({
    baseURL: "https://incident-tracker-api-f0cj.onrender.com/api/v1",
});

//Attach token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;