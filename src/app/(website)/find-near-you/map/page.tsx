/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useFindNearYouStore } from '@/zustand/useFindNearYouStore'
// import MapView from '../_components/map-view'
import MapProductCard from '../_components/map-product-card'
// import { ProductGrid } from '@/components/product/product-grid'
// import { getTrendingProducts } from '@/data/product-data'
import { MapPinOff, Loader2 } from 'lucide-react'
import FindNearMap from '../../_components/find-near-map'
import { normalizeProducts } from '../utility/normalizeProducts'
import { useRef, useCallback } from 'react'

export default function MapPage() {
  const { allProducts, selectedLocation, isLoading, nextPage, pagination, page } = useFindNearYouStore()

  const observer = useRef<IntersectionObserver | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination && page < pagination.totalPages) {
          nextPage()
        }
      }, {
        root: scrollContainerRef.current,
        threshold: 0.1
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, pagination, page, nextPage]
  )

  console.log('All Products:', allProducts)

  const hasProducts = allProducts && allProducts.length > 0

  // Convert selectedLocation to [lng, lat] for Mapbox
  const mapCenter: [number, number] | undefined = selectedLocation
    ? [selectedLocation.longitude, selectedLocation.latitude]
    : undefined

  return (
    <>
      {/* Map + Product List */}
      <section className="container mx-auto mb-12">
        {isLoading && allProducts.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-6 animate-pulse">
            <div className="relative w-full min-h-[500px] bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 gap-6 px-2 h-[650px]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-40 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : hasProducts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-6">
            {/* Left → Map */}
            <div className="relative w-full min-h-[500px] bg-gray-100 overflow-hidden">
              <FindNearMap
                products={normalizeProducts(allProducts)}
                center={mapCenter}
                height={650}
              />
            </div>

            {/* Right → Product Cards */}
            <div
              ref={scrollContainerRef}
              className="grid-cols-1 gap-6 px-2 pr-2 overflow-y-auto max-h-[650px] hidden md:grid border-l border-gray-100 no-scrollbar"
            >
              {allProducts.map((p, idx) => {
                const id = (p as any)?._id ?? (p as any)?.dressId ?? idx
                const name = (p as any)?.dressName ?? 'No Name'

                // ✅ size array handling
                const sizeRaw = (p as any)?.size
                const size = Array.isArray(sizeRaw)
                  ? sizeRaw.join(', ')
                  : sizeRaw ?? 'N/A'

                // ✅ image fallback
                const image =
                  Array.isArray((p as any)?.media) &&
                    (p as any).media.length > 0
                    ? (p as any).media[0]
                    : '/placeholder.svg'

                // ✅ brand
                const brand = (p as any)?.brand ?? 'Unknown'

                // ✅ category
                const category = (p as any)?.category ?? 'N/A'

                // ✅ pickupOption normalizer
                const pickupOption = (
                  (p as any)?.pickupOption || ''
                ).toLowerCase()

                const pickup =
                  pickupOption.includes('pickup') || pickupOption === 'both'

                const shipping =
                  pickupOption.includes('shipping') ||
                  pickupOption.includes('australia') ||
                  pickupOption === 'both'

                return (
                  <MapProductCard
                    key={id}
                    id={id}
                    name={name}
                    size={size}
                    image={image}
                    brand={brand}
                    category={category}
                    shipping={shipping}
                    pickup={pickup}
                  />
                )
              })}

              {/* Infinite Scroll Sentinel */}
              <div ref={lastElementRef} className="h-20 flex flex-col items-center justify-center py-4">
                {isLoading && page > 1 ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  pagination && page >= pagination.totalPages && allProducts.length > 0 && (
                    <span className="text-[10px] tracking-[4px] text-gray-400 uppercase">
                      No more dresses
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-8 lg:py-16">
            <MapPinOff className="h-20 w-20 text-gray-400 mb-4" />
            <h3 className="text-lg md:text-xl font-normal text-gray-700">
              No Products Found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm font-light">
              We couldn&apos;t find any dresses matching your filters.
              Try adjusting your search or increasing your radius.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
