'use client'

import Link from "next/link"
import KoaCard from "./koa-card"

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <KoaCard />

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-[#3D79BE] transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#3D79BE] transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#3D79BE] transition">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#3D79BE] transition">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#3D79BE] transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm border-t border-gray-700 pt-8">
          <p>&copy; {new Date().getFullYear()} KOA Clothing. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-[#3D79BE] transition">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-[#3D79BE] transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#3D79BE] transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
  
}