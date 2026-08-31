import { MapPin, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { AddressDto } from "@/types/address";

interface AddressCardProps {
  address: AddressDto;
  onRemove: (id: string) => void;
}

export default function AddressCard({ address, onRemove }: AddressCardProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">{address.label}</span>
          <span className="rounded-md border text-[0.65rem] font-medium px-1.5 py-0.5 text-muted-foreground">
            {address.type}
          </span>
          {address.isDefault && (
            <span className="rounded-full bg-primary text-primary-foreground text-[0.65rem] font-medium px-2 py-0.5">
              Default
            </span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(address.id)}
          aria-label={`Remove ${address.label}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground leading-relaxed">
        <p>
          {address.houseNo && `${address.houseNo}, `}
          {address.addressLine1}
        </p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.province} {address.zipcode}
        </p>
        <p>{address.country}</p>
      </div>
    </div>
  );
}