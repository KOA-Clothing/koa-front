"use client";

import { MapPin, Plus } from "lucide-react";
import { useState } from "react";

import { AccountEmptyState } from "@/components/account/account-empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressDto } from "@/types/address";

import AddressCard from "./address-card";
import ChangeDefaultConfirmationModal from "./modals/change-default-confirmation-modal";
import CreateAddressModal from "./modals/create-address-modal";
import DeleteAddressConfirmationModal from "./modals/delete-address-confirmation-modal";
import UpdateAddressModal from "./modals/update-address-modal";

interface Props {
  addresses?: AddressDto[];
  onChange?: (addresses: AddressDto[]) => void;
}

export default function AddressSection(props: Props) {
  const addresses = props.addresses ?? [];
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<AddressDto | null>(null);
  const [addressToSetDefault, setAddressToSetDefault] = useState<string | null>(
    null,
  );

  return (
    <Card className="border border-border bg-card ring-0">
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
        <CardDescription>
          Manage the addresses you use for shipping and billing.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {addresses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

            <Button
              variant="outline"
              size="sm"
              className="mt-2 min-h-11 self-start gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add address
            </Button>
          </>
        ) : (
          <AccountEmptyState
            title="No saved addresses"
            description="Add an address to use for shipping and billing."
            icon={<MapPin className="size-8" />}
            className="min-h-40 border-0 bg-transparent px-0 py-8"
          >
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add address
            </Button>
          </AccountEmptyState>
        )}
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
