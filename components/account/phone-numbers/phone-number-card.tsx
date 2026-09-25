import { Pencil, Phone, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneNumberTypeEnum } from "@/types/enums";
import { PhoneNumberDto } from "@/types/phone-number";

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
  const phoneType = PhoneNumberTypeEnum[phone.type as number];

  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="break-words text-sm font-semibold capitalize text-foreground">
            {phone.label}
          </span>
          <Badge variant="outline" className="capitalize">
            {phoneType}
          </Badge>
          {phone.isDefault ? <Badge>Default</Badge> : null}
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:justify-end">
          {!phone.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
              onClick={() => onSetDefault(phone.id)}
              aria-label={`Set ${phone.label} as default`}
            >
              <Star className="size-3.5" aria-hidden="true" />
              Set default
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(phone)}
            aria-label={`Edit ${phone.label} number`}
            title={`Edit ${phone.label} number`}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="min-h-11 min-w-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(phone.id)}
            aria-label={`Remove ${phone.label} number`}
            title={`Remove ${phone.label} number`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 gap-2">
        {phone.countryCode && (
          <Input
            value={phone.countryCode}
            readOnly
            aria-label={`Country code for ${phone.label} phone number`}
            className="h-11 w-20 shrink-0 bg-background text-center text-xs"
          />
        )}
        <Input
          readOnly
          value={phone.phoneNumber}
          onChange={(event) => onChange(phone.id, event.target.value)}
          placeholder="Enter phone number..."
          aria-label={`${phone.label} phone number`}
          className="h-11 min-w-0 text-xs"
        />
      </div>
    </article>
  );
}
