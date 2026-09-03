import { Phone, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { PhoneNumberDto } from "@/types/phone-number";
import { PhoneNumberTypeEnum } from "@/types/enums";

interface PhoneNumberCardProps {
  phone: PhoneNumberDto;
  onEdit: (phone: PhoneNumberDto) => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onChange: (id: string, newNumber: string) => void;
}

export default function PhoneNumberCard({
  phone,
  onEdit,
  onSetDefault,
  onRemove,
  onChange,
}: PhoneNumberCardProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium capitalize">{phone.label}</span>
          <span className="rounded-md border text-[0.65rem] font-medium px-1.5 py-0.5 text-muted-foreground">
            {PhoneNumberTypeEnum[phone.type as number]}
          </span>
          {phone.isDefault && (
            <span className="rounded-full bg-primary text-primary-foreground text-[0.65rem] font-medium px-2 py-0.5">
              Default
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!phone.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onSetDefault(phone.id)}
              aria-label={`Set ${phone.label} as default`}
            >
              <Star className="size-3.5" />
              Set Default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(phone)}
            aria-label={`Edit ${phone.label} number`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(phone.id)}
            aria-label={`Remove ${phone.label} number`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {phone.countryCode && (
          <Input
            value={phone.countryCode}
            readOnly
            className="h-8 w-16 text-xs text-center bg-muted"
          />
        )}
        <Input
          value={phone.phoneNumber}
          onChange={(e) => onChange(phone.id, e.target.value)}
          placeholder="Enter phone number..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
