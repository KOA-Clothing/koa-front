import Image from "next/image";

import logo from "@/public/logo/white/koa-logo.png";

export default function KoaCard() {
  return (
    <div className="max-w-sm text-on-carbon">
      <Image
        src={logo}
        alt="KOA"
        width={180}
        height={67}
        className="h-9 w-auto"
      />
      <p className="mt-4 text-sm leading-relaxed text-on-carbon/70">
        Sri Lankan menswear and activewear, shaped by purpose, clean lines, and
        movement.
      </p>
    </div>
  );
}
