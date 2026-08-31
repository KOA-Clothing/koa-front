"use client"

import AddressSection from "@/components/account/addresses/address-section"
import ProfileSection from "@/components/account/profile/profile-section"
import PhoneNumberSection from "@/components/account/phone-numbers/phone-numbers-section"
import { useState } from "react"
import { BasicProfileDtoSchema, UserProfileDto } from "@/types/user"


export default function Profile() {
  const [userProfile, serUserUserProfile] = useState<UserProfileDto>()

  return (
    <div className="flex flex-col gap-6">
      <ProfileSection initialProfile={userProfile ? BasicProfileDtoSchema.parse(userProfile) : undefined} />
      <AddressSection initialAddresses={userProfile?.addresses} />
      <PhoneNumberSection initialPhones={userProfile?.phoneNumbers} />
    </div>
  )
}
