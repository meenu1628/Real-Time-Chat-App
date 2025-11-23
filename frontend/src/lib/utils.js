import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // adjust to your backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiRequest = async ({
  url,
  method = "GET",
  body = {},
  headers = {},
  params = {},
}) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data: body,
      params,
      headers,
    });
    if (response.status !== 200 && response.status !== 201)
      return { data: null, error: response.data.message }
    else
      return { data: response.data, error: null }
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      err.message ||
      "Something went wrong!";
    return { data: null, error: msg };
  }
}

