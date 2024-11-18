import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (err) => {
        return Promise.reject(err);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log("Response Status Code:", response.status);

        return response;
    },
    (error) => {
        if (error.response) {
            console.error("Error Status Code:", error.response.status);

            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
