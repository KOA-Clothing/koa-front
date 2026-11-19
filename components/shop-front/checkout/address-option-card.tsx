"use client";

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AddressDto } from "@/types/address";
import { AddressTypeEnum } from "@/types/enums";
import RadioIndicator from "./radio-indicator";

interface AddressOptionCardProps {
  address: AddressDto;
  selected: boolean;
  onSelect: () => void;
}

/**
 * A saved address rendered as a selectable card. The whole card is a `<label>`
 * for a visually hidden native radio, so clicking anywhere selects it and
 * keyboard/arrow-key behaviour comes from the browser.
 */
export default function AddressOptionCard({
  address,
  selected,
  onSelect,
}: AddressOptionCardProps) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        selected
          ? "border-foreground bg-muted/40"
          : "border-border bg-card hover:border-foreground/30 hover:bg-muted/20"
      )}
    >
      <input
        type="radio"
        name="delivery-address"
        value={address.id}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <RadioIndicator checked={selected} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <MapPin
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-foreground">
            {address.label}
          </span>
          <Badge variant="outline">{AddressTypeEnum[address.type]}</Badge>
          {address.isDefault && <Badge variant="secondary">Default</Badge>}
        </div>

        <div className="text-sm leading-relaxed text-muted-foreground">
          <p>
            {[address.houseNo, address.addressLine1]
              .filter(Boolean)
              .join(", ")}
          </p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {[address.city, address.province, address.zipcode]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>{address.country}</p>
        </div>
      </div>
    </label>
  );
}
