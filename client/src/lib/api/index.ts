import axios from "../config/axios";
import { TaskFormData } from "../types";

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post("/user/login", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const registerUser = async (data: FormData) => {
  try {
    const response = await axios.post("/user/add", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const userDetails = async () => {
  try {
    const response = await axios.get("/user/me");
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const uploadAvatarForUser = async (data: any) => {
  try {
    const response = await axios.post("/user/avatar", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUser = async (data: any) => {
  try {
    const response = await axios.put("/user/me", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserPassword = async (data: any) => {
  try {
    const response = await axios.post("/user/update-password", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserWallet = async (data: any) => {
  try {
    const response = await axios.post("/user/update-wallet", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserAnalytics = async () => {
  try {
    const response = await axios.get("/user/me/analytics");
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getMyTransactions = async () => {
  try {
    const response = await axios.get("/transactions/me");
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createTransaction = async (data: any) => {
  try {
    const response = await axios.post("/transactions/add", data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTransaction = async (id: any) => {
  try {
    const response = await axios.get("/transactions/" + id);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTransaction = async (id: any, data: any) => {
  try {
    const response = await axios.put("/transactions/" + id, data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteTransaction = async (id: any, data: any) => {
  try {
    const response = await axios.delete("/transactions/" + id, data);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getMyCategories = async () => {
  try {
    const response = await axios.get("/category/all/me");
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createTask = async (data: TaskFormData) => {
  try {
    const response = await axios.post("/task/add", data);
    return response.data.task;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get("/task/all");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTask = async (id: number | undefined) => {
  try {
    const response = await axios.get("/task/" + id);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTaskData = async (id: any, data: Partial<TaskFormData>) => {
  try {
    const response = await axios.put("/task/" + id, data);
    return response.data.task;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTaskStatus = async (
  id: any,
  data: Partial<TaskFormData>
) => {
  try {
    const response = await axios.patch("/task/" + id + "/status", data);
    return response.data.task;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTaskPriority = async (
  id: any,
  data: Partial<TaskFormData>
) => {
  try {
    const response = await axios.patch("/task/" + id + "/priority", data);
    return response.data.task;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteTask = async (id: number | undefined) => {
  try {
    const response = await axios.delete("/task/" + id);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
