"use client"

import AddressSection from "@/components/account/addresses/address-section"
import ProfileSection from "@/components/account/profile/profile-section"
import PhoneNumberSection from "@/components/account/phone-numbers/phone-numbers-section"
import { BasicProfileDtoSchema, UserProfileDtoSchema } from "@/types/user"
import { useAxiosClient } from "@/hooks/use-api-client"
import { API_ROUTES } from "@/configs/api-routes"
import { useQuery } from "@tanstack/react-query"
import LoadingAnimation from "@/components/general/loading"
import Error from "@/components/general/error"

export default function Profile() {
  const axiosClient = useAxiosClient();

  // Fetch profile data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.USERS.PROFILE)
      return UserProfileDtoSchema.parse(response.data)
    },
  })

  // Handle loading state
  if (isLoading) {
    return (
      <LoadingAnimation />
    )
  }

  // Handle error state
  if (isError) {
    console.log(error)
    return (
      <Error error={error} />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileSection profile={data ? BasicProfileDtoSchema.parse(data) : undefined} />
      <AddressSection addresses={data?.addresses} />
      <PhoneNumberSection phoneNumbers={data?.phoneNumbers} />
    </div>
  )
}
