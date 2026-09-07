'use client'

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useMemo } from "react";

export function useAxiosClient() {
  const { getToken } = useAuth();

  // useMemo ensures we don't recreate the Axios instance on every render
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "https://z1z00z54-44330.asse.devtunnels.ms",
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Set the custom Dev Tunnels access header
      // const devTunnelToken = process.env.NEXT_PUBLIC_DEV_TUNNEL_TOKEN || "eyJhbGciOiJFUzI1NiIsImtpZCI6IjYwREY4QzQ0RDE4MjE5MjcxNDA5NUIxM0FDNUNCQTk1MTdCRTUxQzMiLCJ0eXAiOiJKV1QifQ.eyJjbHVzdGVySWQiOiJhc3NlIiwidHVubmVsSWQiOiJoYXBweS1vY2Vhbi16aGc0eDJiIiwic2NwIjoiY29ubmVjdCIsImV4cCI6MTc4ODc3MzExMSwiaXNzIjoiaHR0cHM6Ly90dW5uZWxzLmFwaS52aXN1YWxzdHVkaW8uY29tLyIsIm5iZiI6MTc4ODY4NTgxMX0.9ZiFvnmG2iE0h-gx5hnKKTZ10umRHo1xc4Y7Lavu6MwyXE-Yejcl88KLAbvtiiipawj11yrMXfhwfrj09RP7Lg";
      // config.headers['X-Tunnel-Authorization'] = `tunnel ${devTunnelToken}`;

      return config;
    });

    return instance;
  }, [getToken]);

  return axiosInstance;
}