'use client'

import BlurText from '@/components/BlurText'
import ShinyText from '@/components/ShinyText';
import TextType from '@/components/TextType';
import EmblaCarousel from './EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';

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
  return (
    <section className="relative h-screen overflow-hidden w-full">
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {/* Added pointer-events-auto so inner elements can be interacted with if needed, while allowing clicks through empty space to the carousel */}
        <div className='flex flex-row gap-3 items-baseline justify-center flex-wrap pointer-events-auto'>
          <BlurText
            text="Be"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold text-white mb-4 max-w-2xl"
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
            className='text-7xl md:text-9xl font-bold text-white mb-4 max-w-2xl'
          />
          <BlurText
            text="(/kō-ə/)"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-xl md:text-3xl font-bold text-white/80 mb-4 max-w-2xl"
          />
        </div>
        <div className='flex flex-row gap-3 flex-wrap justify-center pointer-events-auto'>
          <p className='text-2xl md:text-4xl font-mono text-white mb-4 max-w-2xl'>Be </p>
          <TextType 
            text={["Brave.", "Bold.", "Warrior."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="|"
            deletingSpeed={50}
            cursorBlinkDuration={0.5}
            className='text-2xl md:text-4xl font-mono text-white mb-4 max-w-2xl'
          />
        </div>
      </div>
    </section>
  )
}