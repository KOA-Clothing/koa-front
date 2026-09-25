"use client";

import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

interface AnimatedAuthWrapperProps {
  children: ReactNode;
  logoSrc: StaticImageData;
}

export default function AnimatedAuthWrapper({
  children,
  logoSrc,
}: AnimatedAuthWrapperProps) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 text-ink sm:py-10">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.22, ease: "easeOut" }
        }
      >
        <Link
          href="/"
          aria-label="KOA home"
          className="flex size-16 items-center justify-center rounded-card outline-none transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
        >
          <Image
            src={logoSrc}
            alt=""
            width={64}
            height={64}
            priority
            className="size-16 object-contain"
          />
        </Link>
      </motion.div>

      <motion.div
        className="mt-6 w-full max-w-md"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.22, ease: "easeOut", delay: 0.04 }
        }
      >
        {children}
      </motion.div>
    </main>
  );
}
