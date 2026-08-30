'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import logo from "@/public/logo/black/warrior-face.png"
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHomepage) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomepage])

  const isSolidActive = !isHomepage || isScrolled || isHovered

  return (
    <header 
      onMouseEnter={() => isHomepage && setIsHovered(true)}
      onMouseLeave={() => isHomepage && setIsHovered(false)}
      className={`top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isHomepage ? 'fixed' : 'sticky'
      } ${
        isSolidActive 
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/search" 
              className={`text-sm font-medium transition duration-300 ${isSolidActive ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/70'}`}
            >
              Shop
            </Link>
            
            <Link 
              href="/collections" 
              className={`text-sm font-medium transition duration-300 ${isSolidActive ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/70'}`}
            >
              Collections
            </Link>
            
            <Link 
              href="/about" 
              className={`text-sm font-medium transition duration-300 ${isSolidActive ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/70'}`}
            >
              About
            </Link>
          </nav>

          {/* Spacer block to keep flex alignment working on mobile/desktop without layout collapse */}
          <div className="md:hidden invisible w-5" />

          {/* Logo Section - Positioned Absolutely */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link href="/" className="flex items-center shrink-0">
              <div className="w-25 h-15 relative">
                <Image
                  src={logo}
                  alt="KOA Logo"
                  fill
                  sizes="(max-width: 768px) 100px, 100px"
                  priority
                  className={`object-contain transition-all duration-300 ${!isSolidActive ? 'invert brightness-0' : ''}`}
                />
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 z-20">
            <Link
              href='/search'
              className={`p-2 rounded-lg transition duration-300 ${isSolidActive ? 'hover:bg-muted' : 'hover:bg-white/10'}`}
              aria-label="Search"
            >
              <Search className={`w-5 h-5 transition-colors duration-300 ${isSolidActive ? 'text-foreground' : 'text-white'}`} />
            </Link>

            <Button 
              variant="ghost"
              size="icon"
              className={`relative transition duration-300 ${isSolidActive ? 'hover:bg-muted' : 'hover:bg-white/10'}`}
            >
              <ShoppingCart className={`w-5 h-5 transition-colors duration-300 ${isSolidActive ? 'text-foreground' : 'text-white'}`} />
            </Button>

            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton>
                  <button 
                    // Added 'border' to the base classes so the width is always present
                    className={`border rounded-full font-medium text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-4 cursor-pointer transition duration-300 ${
                      isSolidActive 
                        ? 'text-foreground border-neutral-900 hover:bg-muted' 
                        // Added 'border-transparent' to the inactive state
                        : 'text-white border-transparent hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton>
                  <button 
                    className={`border border-transparent rounded-full font-medium text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-4 cursor-pointer transition duration-300 ${
                      isSolidActive 
                        ? 'bg-foreground text-background hover:bg-foreground/90' 
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <div className={`p-1 rounded-full transition duration-300 ${isSolidActive ? 'hover:bg-muted' : 'hover:bg-white/10'}`}>
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}