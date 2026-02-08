'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingProduct } from '@/types/trending-products'

import { ProductCard } from '@/components/product/product-card'
import { Product } from '@/types/product'

type MuseApiResponse = {
  status: boolean
  message: string
  data: TrendingProduct[]
}

const ITEM_COUNT = 5

// shuffle the products array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const TheMuseEdit = () => {
  const { data, isLoading } = useQuery<MuseApiResponse>({
    queryKey: ['the-muse-edit'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dresses`,
      )
      return res.json()
    },
    staleTime: 0, // force freshness
  })

  //  Shuffle + pick 5

  const products = useMemo(() => {
    if (!data?.data?.length) return []
    return shuffleArray(data.data).slice(0, ITEM_COUNT)
  }, [data])

  return (
    <section className="pt-8 max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6">
      {/* 🔹 Header */}
      <div className="text-center mb-12 space-y-5">
        <h2 className="uppercase tracking-[12px] text-lg md:text-xl lg:text-2xl font-light">
          THE MUSE EDIT
        </h2>

        <Link
          href="/shop"
          className="inline-block mt-3 text-sm uppercase tracking-widest border-b border-black pb-1 hover:opacity-70 transition"
        >
          Explore the Edit
        </Link>
      </div>

      {/* 🔹 Responsive Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full max-w-[1500px]">
          {isLoading
            ? Array.from({ length: ITEM_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col h-full animate-pulse">
                <div className="overflow-hidden mb-4 aspect-[2/3] w-full bg-gray-200" />
                <div className="text-center space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))
            : products.map(product => (
              <ProductCard key={product._id} product={product as unknown as Product} />
            ))}
        </div>
      </div>
    </section>
  )
}

export default TheMuseEdit
