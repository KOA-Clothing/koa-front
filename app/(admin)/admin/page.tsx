'use client'

import { useUserProfile } from "@/features/account/hooks/use-user-profile";

export default function Admin() {
  const { data, isLoading, isError, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}