"use client"

import { AddressDto } from "@/types/address";
import AddressFormModal from "./address-form-modal";

interface UpdateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressDto | null;
}

export default function UpdateAddressModal({
  open,
  onOpenChange,
  address,
}: UpdateAddressModalProps) {
  return <AddressFormModal open={open} onOpenChange={onOpenChange} address={address} />;
}
