'use client'

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import BlurText from '@/components/BlurText'
import ShinyText from '@/components/ShinyText';
import TextType from '@/components/TextType';
import EmblaCarousel from './embla/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { PAGE_ROUTES } from '@/lib/configs/page-routes';

// Extracted outside the component to prevent re-instantiation on renders
const OPTIONS: EmblaOptionsType = {
  axis: 'x', 
  loop: true, 
  direction: 'ltr', 
  skipSnaps: true, 
  align: 'center', 
  containScroll: false
}

const SLIDES = [
  '/hero-images/hero-1.jpg',
  '/hero-images/hero-2.jpg',
  '/hero-images/hero-3.jpg',
]

export function Hero() {
  const handleScrollDown = () => {
    const el = document.getElementById('shop-sections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden w-full">
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-10">
        <div className="flex flex-row gap-3 items-baseline justify-center flex-wrap pointer-events-auto">
          <BlurText
            text="Be"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold text-white mb-4 max-w-2xl drop-shadow-md"
          />
          <ShinyText
            text="KOA"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-7xl md:text-9xl font-bold text-white mb-4 max-w-2xl drop-shadow-lg"
          />
          <BlurText
            text="(/kō-ə/)"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-xl md:text-3xl font-bold text-white/80 mb-4 max-w-2xl font-mono"
          />
        </div>

        <div className="flex flex-row gap-3 flex-wrap justify-center pointer-events-auto">
          <p className="text-2xl md:text-4xl font-mono text-white mb-4 max-w-2xl">Be </p>
          <TextType 
            text={["Brave.", "Bold.", "Warrior."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="|"
            deletingSpeed={50}
            cursorBlinkDuration={0.5}
            className="text-2xl md:text-4xl font-mono text-white mb-4 max-w-2xl"
          />
        </div>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
          <Link
            href={PAGE_ROUTES.SHOP.SEARCH}
            className="px-8 py-3.5 rounded-full bg-white text-neutral-950 font-semibold text-xs uppercase tracking-[0.18em] shadow-xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 duration-200"
          >
            Explore Drops
          </Link>
          <Link
            href={PAGE_ROUTES.SHOP.COLLECTIONS}
            className="px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/30 font-semibold text-xs uppercase tracking-[0.18em] shadow-xl hover:bg-white/10 hover:border-white transition-all hover:scale-105 active:scale-95 duration-200"
          >
            Explore Collections
          </Link>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={handleScrollDown}
          type="button"
          aria-label="Scroll to content"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-white/60 group-hover:text-white transition-colors">
            Scroll
          </span>
          <ChevronDown className="size-4 animate-bounce text-white/80 group-hover:text-white" />
        </button>
      </div>
    </section>
  )
}
