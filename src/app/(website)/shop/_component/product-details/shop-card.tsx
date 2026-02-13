/* eslint-disable */
'use client'

import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

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

  const images = [thumbnailImage, ...allImages].filter(Boolean)

  // --------------------------------------- CHECK EXISTING WISHLIST ITEM----------------------------------------
  useEffect(() => {
    if (!productdata?._id) return

    const stored = localStorage.getItem("wishlist")
    if (stored) {
      const wishlist = JSON.parse(stored)
      const exists = wishlist.some((p: any) => p._id === productdata._id)
      setIsWishlisted(exists)
    }
  }, [productdata])

  // -------------- TOGGLE WISHLIST---------------------------
  const handleToggleWishlist = () => {
    if (!session) {
      alert("Please login to add items to your wishlist.")
      router.push('/login')
      return
    }

    const stored = localStorage.getItem("wishlist")
    let wishlist = stored ? JSON.parse(stored) : []

    const exists = wishlist.some((item: any) => item?._id === productdata?._id)

    if (exists) {
      // 🔥 Remove
      wishlist = wishlist.filter((item: any) => item?._id !== productdata?._id)
      setIsWishlisted(false)
    } else {
      // 🔥 Add
      wishlist.push(productdata)
      setIsWishlisted(true)
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }

  // -------------------------- LOADING UI-------------------------------------------
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-5 animate-pulse">
        <div className="flex flex-row lg:flex-col gap-5 lg:w-[20%] w-full overflow-x-auto lg:overflow-visible">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border min-w-[150px] lg:h-[150px] h-[100px] bg-gray-300 rounded"
            />
          ))}
        </div>

        <div className="flex-1 min-h-[400px] lg:h-[660px] relative">
          <div className="w-full h-full bg-gray-300 rounded-lg" />
          <div className="flex items-center gap-5 absolute right-4 top-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------ MAIN UI-----------------------------------------------------
  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Sidebar Thumbnails */}
      <div className="flex flex-row lg:flex-col gap-5 lg:w-[22%] w-full overflow-x-auto lg:overflow-visible">
        {images.map((src, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`min-w-[100px] lg:h-[150px] h-[110px] cursor-pointer rounded overflow-hidden border-[2px] ${currentImageIndex === index ? 'border-gray-500' : 'border-transparent'
              }`}
          >
            <Image
              src={src || '/placeholder.jpg'}
              alt={`image-${index}`}
              width={500}
              height={500}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="flex-1 min-h-[500px] lg:h-[800px] relative">
        <Image
          src={images[currentImageIndex] || '/placeholder.jpg'}
          alt={`main-image-${currentImageIndex}`}
          fill
          className="object-cover object-top rounded-lg"
        />

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-5 absolute right-4 top-4 text-white">

          {/* ❤️ WISHLIST TOGGLE */}
          <Heart
            onClick={handleToggleWishlist}
            className={`bg-black/60 p-2 rounded-full w-9 h-9 cursor-pointer transition-all duration-300 
              ${isWishlisted ? 'fill-[#ff0000] text-[#ff0000]' : 'text-white'}`}
          />
        </div>
      </div>
    </div>
  )
}

export default ShopCard
