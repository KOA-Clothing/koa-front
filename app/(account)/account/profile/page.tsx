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
import { AddressDto } from "@/types/address"
import { AddressTypeSchema } from "@/types/enums"
import { PhoneNumberDto } from "@/types/phone-number"


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
    return (
      <Error error={error} />
    )
  }

  var test : AddressDto[] = [
      {
      id: "45330gtrggg4g",
      label: "test",
      houseNo: "714/3",
      addressLine1: "Gemunu Mwatha",
      addressLine2: "Homagama",
      city: "Homagama",
      province: "Colombo",
      country: "Sri Lanka",
      isDefault: true,
      zipcode: "10200",
      createdAt: "",
      updatedAt: "",
      type: 1
    }
  ]

  var test2: PhoneNumberDto[] = [
    {
      id: "34545f3r",
      label: "test",
      phoneNo: "112895668",
      type: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true,
      countryCode: "+94",
      isVerified: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <ProfileSection profile={data ? BasicProfileDtoSchema.parse(data) : undefined} />
      <AddressSection addresses={data?.addresses} />
      <PhoneNumberSection phoneNumbers={data?.phoneNumbers} />
    </div>
  )
}