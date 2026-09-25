import { MapPin, Pencil, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddressDto } from "@/types/address";
import { AddressTypeEnum } from "@/types/enums";

interface AddressCardProps {
  address: AddressDto;
  onEdit: (address: AddressDto) => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onRemove,
}: AddressCardProps) {
  const addressType = AddressTypeEnum[address.type as number];

  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="break-words text-sm font-semibold text-foreground">
            {address.label}
          </span>
          <Badge variant="outline" className="capitalize">
            {addressType}
          </Badge>
          {address.isDefault ? <Badge>Default</Badge> : null}
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:justify-end">
          {!address.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
              onClick={() => onSetDefault(address.id)}
              aria-label={`Set ${address.label} as default`}
            >
              <Star className="size-3.5" aria-hidden="true" />
              Set default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(address)}
            aria-label={`Edit ${address.label}`}
            title={`Edit ${address.label}`}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="min-h-11 min-w-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(address.id)}
            aria-label={`Remove ${address.label}`}
            title={`Remove ${address.label}`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <address className="break-words text-sm leading-relaxed text-muted-foreground not-italic">
        <p>
          {address.houseNo && `${address.houseNo}, `}
          {address.addressLine1}
        </p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.province} {address.zipcode}
        </p>
        <p>{address.country}</p>
      </address>
    </article>
  );
}
