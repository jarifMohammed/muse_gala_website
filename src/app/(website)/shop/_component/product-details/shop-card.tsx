/* eslint-disable */
'use client'

import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'

interface ShopCardProps {
  allImages: string[]
  thumbnailImage: string
  isLoading: boolean
  productdata: any
}

const ShopCard = ({ thumbnailImage, allImages, isLoading, productdata }: ShopCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const touchStartX = useRef<number | null>(null)

  const images = [thumbnailImage, ...allImages].filter(Boolean)

  // --------------------------------------- CHECK EXISTING WISHLIST ITEM ----------------------------------------
  useEffect(() => {
    if (!productdata?._id) return
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      const wishlist = JSON.parse(stored)
      const exists = wishlist.some((p: any) => p._id === productdata._id)
      setIsWishlisted(exists)
    }
  }, [productdata])

  // -------------- TOGGLE WISHLIST ---------------------------
  const handleToggleWishlist = () => {
    if (!session) {
      alert('Please login to add items to your wishlist.')
      router.push('/login')
      return
    }

    const stored = localStorage.getItem('wishlist')
    let wishlist = stored ? JSON.parse(stored) : []
    const exists = wishlist.some((item: any) => item?._id === productdata?._id)

    if (exists) {
      wishlist = wishlist.filter((item: any) => item?._id !== productdata?._id)
      setIsWishlisted(false)
    } else {
      wishlist.push(productdata)
      setIsWishlisted(true)
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }

  // -------------- SWIPE HANDLERS ---------------------------
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left → next image
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      } else {
        // swipe right → prev image
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }
    touchStartX.current = null
  }

  // -------------------------- LOADING UI -------------------------------------------
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 animate-pulse">
        <div className="hidden lg:flex flex-row lg:flex-col gap-5 lg:w-[20%] w-full overflow-x-auto lg:overflow-visible">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border min-w-[150px] aspect-square bg-gray-300" />
          ))}
        </div>
        <div className="flex-1 aspect-[3/4] lg:aspect-square relative">
          <div className="w-full h-full bg-gray-300" />
          <div className="flex items-center gap-5 absolute right-4 top-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------ MAIN UI -----------------------------------------------------
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
      {/* Sidebar Thumbnails — desktop only */}
      <div className="hidden lg:flex flex-col gap-4 lg:w-[22%] h-fit max-h-[700px] overflow-y-auto scrollbar-hide sticky top-28">
        {images.map((src, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-full aspect-[4/5] cursor-pointer overflow-hidden border-[1px] transition-all duration-300 ${currentImageIndex === index
              ? 'border-black'
              : 'border-transparent hover:border-black/30'
              }`}
          >
            <Image
              src={src || '/placeholder.jpg'}
              alt={`thumbnail-${index}`}
              width={200}
              height={250}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* Main Image + swipe on mobile */}
      <div className="flex-1 flex flex-col sticky top-28 h-fit">
        <div
          className="flex-1 aspect-[3/4] lg:aspect-[4/5] lg:max-h-[800px] overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[currentImageIndex] || '/placeholder.jpg'}
            alt={`main-image-${currentImageIndex}`}
            fill
            className="object-cover object-top select-none"
            draggable={false}
          />

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-5 absolute right-4 top-4 text-white">
            <Heart
              onClick={handleToggleWishlist}
              className={`bg-black/60 p-2 rounded-full w-9 h-9 cursor-pointer transition-all duration-300 ${isWishlisted ? 'fill-[#ff0000] text-[#ff0000]' : 'text-white'
                }`}
            />
          </div>
        </div>

        {/* Dot indicators — mobile only, only when > 1 image */}
        {images.length > 1 && (
          <div className="flex lg:hidden justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === currentImageIndex
                    ? 'w-4 h-1.5 bg-black'
                    : 'w-1.5 h-1.5 bg-black/25'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopCard
