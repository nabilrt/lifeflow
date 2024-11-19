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

            // Check for specific status codes and handle them
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
            }

            // Attach the API error message if available
            const apiErrorMessage =
                error.response.data?.error || error.response.data?.message;
            error.message = apiErrorMessage || error.message;
        } else if (error.request) {
            // Request was made but no response received
            error.message = "No response received from the server.";
        } else {
            // Something happened in setting up the request
            error.message = error.message || "An unexpected error occurred.";
        }

        return Promise.reject(error); // Pass the enhanced error object
    }
);

export default instance;
