'use client'

import { useAxiosClient } from "@/hooks/use-api-client";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const fetchClient = useAxiosClient();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const response = await fetchClient("api/v1/auth/me");
      return response.data; 
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}