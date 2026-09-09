"use client"

import AddressSection from "@/components/account/addresses/address-section"
import ProfileSection from "@/components/account/profile/profile-section"
import PhoneNumberSection from "@/components/account/phone-numbers/phone-numbers-section"
import { BasicProfileDtoSchema } from "@/types/user"
import { useUserProfile } from "@/features/account/hooks/use-user-profile"
import LoadingAnimation from "@/components/general/loading"
import Error from "@/components/general/error"

export default function Profile() {
  const { data, isLoading, isError, error } = useUserProfile();

  if (isLoading) {
    return (
      <LoadingAnimation />
    )
  }

  if (isError) {
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