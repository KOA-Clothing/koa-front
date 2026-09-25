"use client";

import { Phone, Plus } from "lucide-react";
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
import { PhoneNumberDto } from "@/types/phone-number";

import ChangeDefaultConfirmationModal from "./modals/change-default-confirmation-modal";
import CreatePhoneNumberModal from "./modals/create-phone-number-modal";
import DeletePhoneNumberConfirmationModal from "./modals/delete-phone-number-confirmation-modal";
import UpdatePhoneNumberModal from "./modals/update-phone-number-modal";
import PhoneNumberCard from "./phone-number-card";

interface Props {
  phoneNumbers?: PhoneNumberDto[];
  onChange?: (phones: PhoneNumberDto[]) => void;
}

export default function PhoneNumberSection(props: Props) {
  const [phones, setPhones] = useState<PhoneNumberDto[]>(
    props.phoneNumbers ?? [],
  );
  const [prevPhoneNumbers, setPrevPhoneNumbers] = useState(props.phoneNumbers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);
  const [phoneToEdit, setPhoneToEdit] = useState<PhoneNumberDto | null>(null);
  const [phoneToSetDefault, setPhoneToSetDefault] = useState<string | null>(
    null,
  );

  if (props.phoneNumbers !== prevPhoneNumbers) {
    setPrevPhoneNumbers(props.phoneNumbers);
    setPhones(props.phoneNumbers ?? []);
  }

  const handleRemove = (id: string) => {
    setPhoneToDelete(id);
  };

  const handleChange = (id: string, newNumber: string) => {
    const updated = phones.map((phone) =>
      phone.id === id ? { ...phone, phoneNo: newNumber } : phone,
    );
    setPhones(updated);
    if (props.onChange) props.onChange(updated);
  };

  return (
    <Card className="border border-border bg-card ring-0">
      <CardHeader>
        <CardTitle>Phone numbers</CardTitle>
        <CardDescription>
          Manage the phone numbers on your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {phones.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {phones.map((phone) => (
                <PhoneNumberCard
                  key={phone.id}
                  phone={phone}
                  onEdit={setPhoneToEdit}
                  onSetDefault={setPhoneToSetDefault}
                  onRemove={handleRemove}
                  onChange={handleChange}
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
              Add phone number
            </Button>
          </>
        ) : (
          <AccountEmptyState
            title="No phone numbers"
            description="Add a phone number to keep your account details complete."
            icon={<Phone className="size-8" />}
            className="min-h-40 border-0 bg-transparent px-0 py-8"
          >
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add phone number
            </Button>
          </AccountEmptyState>
        )}
      </CardContent>

      <CreatePhoneNumberModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <UpdatePhoneNumberModal
        open={phoneToEdit !== null}
        onOpenChange={(open) => {
          if (!open) setPhoneToEdit(null);
        }}
        phone={phoneToEdit}
      />

      <ChangeDefaultConfirmationModal
        open={phoneToSetDefault !== null}
        onOpenChange={(open) => {
          if (!open) setPhoneToSetDefault(null);
        }}
        phoneId={phoneToSetDefault}
      />

      <DeletePhoneNumberConfirmationModal
        open={phoneToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPhoneToDelete(null);
        }}
        phoneId={phoneToDelete}
      />
    </Card>
  );
}
