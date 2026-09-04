"use client"

import Image from "next/image";
import { SsoProvider, SsoProviderEnum } from "@/types/enums";

const SSO_PROVIDERS: Record<SsoProvider, { label: string; icon: string }> = {
  [SsoProviderEnum.GOOGLE]: { label: "Google", icon: "/icons/sso/google.svg" },
  [SsoProviderEnum.APPLE]: { label: "Apple", icon: "/icons/sso/apple.svg" },
  [SsoProviderEnum.MICROSOFT]: { label: "Microsoft", icon: "/icons/sso/microsoft.svg" },
  [SsoProviderEnum.LINKEDIN]: { label: "LinkedIn", icon: "/icons/sso/linkedin.svg" },
  [SsoProviderEnum.GITHUB]: { label: "GitHub", icon: "/icons/sso/github.svg" },
  [SsoProviderEnum.FACEBOOK]: { label: "Facebook", icon: "/icons/sso/facebook.svg" },
};

interface SsoAccountsProps {
  providers: SsoProvider[];
}

export default function SsoAccounts({ providers }: SsoAccountsProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <span className="text-sm font-medium text-muted-foreground">Signed in with</span>
      <div className="flex flex-wrap justify-end gap-2">
        {providers.map((provider, index) => {
          const config = SSO_PROVIDERS[provider];
          if (!config) {
            return null;
          }
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5"
            >
              <Image
                src={config.icon}
                alt={`${config.label} logo`}
                width={18}
                height={18}
              />
              <span className="text-sm">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}