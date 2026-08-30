import type { Metadata } from "next";
import logo from "@/public/logo/black/warrior-face.png";
import AnimatedAuthWrapper from "@/components/auth/AnimatedAuthWrapper";

// Type definition placeholder assuming you have this defined elsewhere
interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Authentication | KOA",
  description: "Sign in or create an account",
};

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <AnimatedAuthWrapper logoSrc={logo}>
      {children}
    </AnimatedAuthWrapper>
  );
}