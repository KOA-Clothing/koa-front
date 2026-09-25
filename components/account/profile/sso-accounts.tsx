"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { SsoProvider, SsoProviderEnum } from "@/types/enums";

const SSO_PROVIDERS: Record<SsoProvider, { label: string; icon: string }> = {
  [SsoProviderEnum.GOOGLE]: { label: "Google", icon: "/icons/sso/google.svg" },
  [SsoProviderEnum.APPLE]: { label: "Apple", icon: "/icons/sso/apple.svg" },
  [SsoProviderEnum.MICROSOFT]: {
    label: "Microsoft",
    icon: "/icons/sso/microsoft.svg",
  },
  [SsoProviderEnum.LINKEDIN]: {
    label: "LinkedIn",
    icon: "/icons/sso/linkedin.svg",
  },
  [SsoProviderEnum.GITHUB]: { label: "GitHub", icon: "/icons/sso/github.svg" },
  [SsoProviderEnum.FACEBOOK]: {
    label: "Facebook",
    icon: "/icons/sso/facebook.svg",
  },
};

interface SsoAccountsProps {
  providers: SsoProvider[];
}

export default function SsoAccounts({ providers }: SsoAccountsProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col items-start gap-2 lg:items-end">
      <span className="text-sm font-medium text-muted-foreground">
        Signed in with
      </span>
      <div className="flex flex-wrap gap-2 lg:justify-end">
        {providers.map((provider, index) => {
          const config = SSO_PROVIDERS[provider];
          if (!config) {
            return null;
          }

          return (
            <Badge
              key={`${provider}-${index}`}
              variant="outline"
              className="h-7 gap-2 px-2.5"
            >
              <Image
                src={config.icon}
                alt=""
                width={18}
                height={18}
                aria-hidden="true"
              />
              {config.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
