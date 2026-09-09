'use client'

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useMemo } from "react";

export function useAxiosClient() {
  const { getToken } = useAuth();

  // useMemo ensures we don't recreate the Axios instance on every render
  const axiosInstance = useMemo(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    if (!baseURL) {
      throw new Error("NEXT_PUBLIC_API_URL is not set. Configure it in .env.local.");
    }

    const instance = axios.create({ baseURL });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return axiosInstance;
}