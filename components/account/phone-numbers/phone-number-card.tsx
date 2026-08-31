import { Phone, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { PhoneNumberDto } from "@/types/phone-number";

interface PhoneNumberCardProps {
  phone: PhoneNumberDto;
  onRemove: (id: string) => void;
  onChange: (id: string, newNumber: string) => void;
}

export default function PhoneNumberCard({ phone, onRemove, onChange }: PhoneNumberCardProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium capitalize">{phone.label}</span>
          <span className="rounded-md border text-[0.65rem] font-medium px-1.5 py-0.5 text-muted-foreground">
            {phone.type}
          </span>
          {phone.isDefault && (
            <span className="rounded-full bg-primary text-primary-foreground text-[0.65rem] font-medium px-2 py-0.5">
              Default
            </span>
          )}
        </div>

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

      <div className="flex gap-2">
        {phone.countryCode && (
          <Input
            value={phone.countryCode}
            readOnly
            className="h-8 w-16 text-xs text-center bg-muted"
          />
        )}
        <Input
          value={phone.phoneNo}
          onChange={(e) => onChange(phone.id, e.target.value)}
          placeholder="Enter phone number..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}