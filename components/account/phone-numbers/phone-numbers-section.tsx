"use client"

import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { PhoneNumberDto } from "@/types/phone-number";
import PhoneNumberCard from "./phone-number-card";
import CreatePhoneNumberModal from "./modals/create-phone-number-modal";
import UpdatePhoneNumberModal from "./modals/update-phone-number-modal";
import ChangeDefaultConfirmationModal from "./modals/change-default-confirmation-modal";
import DeletePhoneNumberConfirmationModal from "./modals/delete-phone-number-confirmation-modal";

interface Props {
  phoneNumbers?: PhoneNumberDto[];
  onChange?: (phones: PhoneNumberDto[]) => void;
}

export default function PhoneNumberSection(props: Props) {
  const [phones, setPhones] = useState<PhoneNumberDto[]>(props.phoneNumbers ?? []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);
  const [phoneToEdit, setPhoneToEdit] = useState<PhoneNumberDto | null>(null);
  const [phoneToSetDefault, setPhoneToSetDefault] = useState<string | null>(null);

  useEffect(() => {
    if (props.phoneNumbers) {
      setPhones(props.phoneNumbers);
    }
  }, [props.phoneNumbers]);

  const handleRemove = (id: string) => {
    setPhoneToDelete(id);
  };

  const handleChange = (id: string, newNumber: string) => {
    const updated = phones.map((p) =>
      p.id === id ? { ...p, phoneNo: newNumber } : p
    );
    setPhones(updated);
    if (props.onChange) props.onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Numbers</CardTitle>
        <CardDescription>Manage the phone numbers on your account.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <div className="flex justify-start mt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="size-3.5" />
            Add phone number
          </Button>
        </div>
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
