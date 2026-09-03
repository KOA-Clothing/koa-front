"use client"

import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { AddressDto } from "@/types/address";
import { useState, useEffect } from "react";
import AddressCard from "./address-card";
import CreateAddressModal from "./create-address-modal";
import UpdateAddressModal from "./update-address-modal";
import ChangeDefaultConfirmationModal from "./change-default-confirmation-modal";
import DeleteAddressConfirmationModal from "./delete-address-confirmation-modal";

interface Props {
  addresses?: AddressDto[];
  onChange?: (addresses: AddressDto[]) => void;
}

export default function AddressSection(props: Props) {
  const [addresses, setAddresses] = useState<AddressDto[]>(props.addresses ?? []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<AddressDto | null>(null);
  const [addressToSetDefault, setAddressToSetDefault] = useState<string | null>(null);

  useEffect(() => {
    if (props.addresses) {
      setAddresses(props.addresses);
    }
  }, [props.addresses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
        <CardDescription>Manage the addresses you use for shipping and billing.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              onEdit={setAddressToEdit}
              onSetDefault={setAddressToSetDefault}
              onRemove={setAddressToDelete} 
            />
          ))}
        </div>

        <div className="flex justify-start mt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="size-3.5" />
            Add address
          </Button>
        </div>
      </CardContent>

      <CreateAddressModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <UpdateAddressModal
        open={addressToEdit !== null}
        onOpenChange={(open) => {
          if (!open) setAddressToEdit(null);
        }}
        address={addressToEdit}
      />

      <ChangeDefaultConfirmationModal
        open={addressToSetDefault !== null}
        onOpenChange={(open) => {
          if (!open) setAddressToSetDefault(null);
        }}
        addressId={addressToSetDefault}
      />

      <DeleteAddressConfirmationModal
        open={addressToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setAddressToDelete(null);
        }}
        addressId={addressToDelete}
      />
    </Card>
  );
}