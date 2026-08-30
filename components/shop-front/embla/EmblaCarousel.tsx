'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { usePrevNextButtons } from './EmblaCarouselArrowButtons'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
}

const EmblaCarousel = (props: PropType) => {
  const { slides, options } = props

  // Memoize plugins to prevent re-initialization on every render
  const plugins = useMemo(() => [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
    Fade()
  ], [])

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  return (
    <div className="relative w-full h-full">
      <div className="embla__viewport overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((src, index) => (
            <div className="embla__slide flex-[0_0_100%] min-w-0 h-full relative" key={index}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition disabled:opacity-30"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        type="button"
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 532 532" className="w-4 h-4">
          <path fill="currentColor" d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition disabled:opacity-30"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        type="button"
        aria-label="Next slide"
      >
        <svg viewBox="0 0 532 532" className="w-4 h-4">
          <path fill="currentColor" d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === selectedIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default EmblaCarousel