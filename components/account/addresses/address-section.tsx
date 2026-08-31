"use client"

import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { AddressDto } from "@/types/address";
import { useState } from "react";
import AddressCard from "./address-card"; // Adjust path as needed

interface AddressSectionProps {
  initialAddresses?: AddressDto[];
  onAddressesChange?: (addresses: AddressDto[]) => void;
}

export default function AddressSection({ initialAddresses = [], onAddressesChange }: AddressSectionProps) {
  const [addresses, setAddresses] = useState<AddressDto[]>(initialAddresses);

  const addAddress = () => {
    const now = new Date().toISOString();
    
    const newAddress: AddressDto = {
      id: crypto.randomUUID(),
      label: "New Address",
      houseNo: "",
      addressLine1: "Enter address line 1",
      addressLine2: "",
      city: "City",
      province: "Province",
      zipcode: "00000",
      country: "Country",
      type: "Shipping",
      isDefault: addresses.length === 0,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    if (onAddressesChange) onAddressesChange(updated);
  };

  const removeAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (onAddressesChange) onAddressesChange(updated);
  };

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
              onRemove={removeAddress} 
            />
          ))}
        </div>

        <div className="flex justify-start mt-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={addAddress}>
            <Plus className="size-3.5" />
            Add address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}