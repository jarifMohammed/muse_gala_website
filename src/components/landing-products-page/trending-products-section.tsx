'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { TrendingProduct } from '@/types/trending-products'

import { ProductCard } from '@/components/product/product-card'
import { Product } from '@/types/product'

type TrendingApiResponse = {
  status: boolean
  message: string
  data: TrendingProduct[]
}

const TrendingNow = () => {
  const { data, isLoading } = useQuery<TrendingApiResponse>({
    queryKey: ['trending-now'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dresses?limit=5`,
      )
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })

  const products = data?.data ?? []

  return (
    <section className="max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6">
      {/* 🔹 Header */}
      <div className="text-center mb-12 space-y-5">
        <h2 className="uppercase tracking-[12px] text-lg md:text-xl lg:text-2xl font-light">
          Trending Now
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
            ? Array.from({ length: 5 }).map((_, i) => (
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

export default TrendingNow
