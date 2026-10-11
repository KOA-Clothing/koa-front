'use client'

import Link from "next/link"
import KoaCard from "./koa-card"

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-neutral-900 text-white">

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-40">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">

          {/* Koa Card */}
          <div>
            <KoaCard />
          </div>

          {/* Right Side */}
          <div className="flex flex-col">

            {/* Three Link Groups */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

              {/* Shop */}
              <div>
                <h4 className="mb-4 font-semibold">
                  Shop
                </h4>

                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/search"
                      className="transition hover:text-[#3D79BE]"
                    >
                      All Products
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/search"
                      className="transition hover:text-[#3D79BE]"
                    >
                      New Arrivals
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/search"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Best Sellers
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/collections"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Collections
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="mb-4 font-semibold">
                  Company
                </h4>

                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      About Us
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Our Story
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="mb-4 font-semibold">
                  Support
                </h4>

                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      FAQ
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Shipping Info
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Returns &amp; Exchanges
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      className="transition hover:text-[#3D79BE]"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* Copyright / Bottom Bar */}
            <div className="mt-8 border-t border-gray-700 pt-6">

              <div className="flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">

                <p>
                  &copy; {new Date().getFullYear()} KOA Clothing.
                  All rights reserved.
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link
                    href="/about"
                    className="transition hover:text-[#3D79BE]"
                  >
                    Terms of Service
                  </Link>

                  <Link
                    href="/about"
                    className="transition hover:text-[#3D79BE]"
                  >
                    Privacy Policy
                  </Link>

                  <Link
                    href="/about"
                    className="transition hover:text-[#3D79BE]"
                  >
                    Cookie Policy
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Large Background Brand */}
      <div
        aria-hidden="true"
        className="
          pb-10
          pointer-events-none
          absolute
          bottom-[-5vw]
          left-1/2
          z-0
          -translate-x-1/2
          select-none
          whitespace-nowrap
          text-[19vw]
          font-black
          leading-none
          tracking-[0.07em]
          text-white
          opacity-[0.035]
        "
      >
        KOA
      </div>

    </footer>
  )
}