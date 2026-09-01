"use client"

import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { useState, useEffect } from "react";
import { PhoneNumberDto } from "@/types/phone-number";
import PhoneNumberCard from "./phone-number-card";

interface Props {
  phoneNumbers?: PhoneNumberDto[];
  onChange?: (phones: PhoneNumberDto[]) => void;
}

export default function PhoneNumberSection(props: Props) {
  const [phones, setPhones] = useState<PhoneNumberDto[]>(props.phoneNumbers ?? []);

  useEffect(() => {
    if (props.phoneNumbers) {
      setPhones(props.phoneNumbers);
    }
  }, [props.phoneNumbers]);

  const addPhone = () => {
    const now = new Date().toISOString();
    
    const newPhone: PhoneNumberDto = {
      id: crypto.randomUUID(),
      label: "Mobile",
      phoneNo: "",
      countryCode: "+1",
      type: 1,
      isDefault: phones.length === 0,
      isVerified: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...phones, newPhone];
    setPhones(updated);
    if (props.onChange) props.onChange(updated);
  };

  const hanldeRemove = (id: string) => {
    const updated = phones.filter((p) => p.id !== id);
    setPhones(updated);
    if (props.onChange) props.onChange(updated);
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
              onRemove={hanldeRemove}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="flex justify-start mt-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={addPhone}>
            <Plus className="size-3.5" />
            Add phone number
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}