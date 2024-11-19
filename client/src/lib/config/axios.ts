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
        return response;
    },
    (error) => {
        if (error.response) {
            // Check for specific status codes and handle them
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
            }

            const apiErrorMessage =
                error.response.data?.error || error.response.data?.message;
            error.message = apiErrorMessage || error.message;
        } else if (error.request) {
            error.message = "No response received from the server.";
        } else {
            error.message = error.message || "An unexpected error occurred.";
        }

        return Promise.reject(error);
    }
);

export default instance;
