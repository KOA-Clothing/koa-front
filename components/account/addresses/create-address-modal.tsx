"use client"

import AddressFormModal from "./address-form-modal";

interface CreateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAddressModal({
  open,
  onOpenChange,
}: CreateAddressModalProps) {
  return <AddressFormModal open={open} onOpenChange={onOpenChange} />;
}
