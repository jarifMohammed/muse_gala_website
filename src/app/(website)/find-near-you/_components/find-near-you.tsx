/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Filter, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import AustraliaLocationSelector from '@/components/ui/australia-location-selector'
import ProductList from './product-list'
import { usePathname } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useFindNearYouStore } from '@/zustand/useFindNearYouStore'
import { useEffect, useState } from 'react'
import type { ApiProduct } from '@/app/(website)/find-near-you/utility/normalizeProducts'
import ViewToggle from './view-toggle'

export default function FindNearYou() {
  const pathname = usePathname()
  const isMapPage = pathname === '/find-near-you/map'

  // Zustand store
  const {
    selectedLocation,
    radius,
    size,
    category,
    minPrice,
    maxPrice,
    page,
    allProducts,
    pagination,
    setState,
    resetPage,
    nextPage,
    setAllProducts,
    setPagination,
  } = useFindNearYouStore()

  // UI
  const [showFilters, setShowFilters] = useState(false)
  const mapboxtoken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // Fetcher
  const fetchProducts = async (): Promise<ApiProduct[]> => {
    if (!selectedLocation) return []

    const queryParams = new URLSearchParams({
      latitude: String(selectedLocation.latitude),
      longitude: String(selectedLocation.longitude),
      radius: String(radius * 1000),
      page: String(page),
    })
    if (size) queryParams.append('size', size)
    if (category) queryParams.append('category', category)
    if (minPrice) queryParams.append('minPrice', minPrice)
    if (maxPrice) queryParams.append('maxPrice', maxPrice)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/v1/admin/?${queryParams.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch products')

    const data = await res.json()
    setPagination(data?.pagination || null)

    return data?.data || []
  }

  const { data, isFetching, isError, error, refetch, isLoading } = useQuery({
    queryKey: [
      'products',
      selectedLocation,
      radius,
      size,
      category,
      minPrice,
      maxPrice,
      page,
    ],
    queryFn: fetchProducts,
    enabled: false,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })


  // Merge fetched products into Zustand
  useEffect(() => {
    if (!data) return

    if (page === 1) {
      setAllProducts(data) // reset list
    } else {
      setAllProducts((prev) => {
        const ids = new Set(prev.map((p) => p._id))
        const newOnes = data.filter((p) => !ids.has(p._id))
        return [...prev, ...newOnes]
      })
    }
  }, [data, page, setAllProducts])

  // Manual trigger functions
  const handleSearchNearYou = () => {
    if (!selectedLocation) return
    resetPage()
    setAllProducts([])
    refetch()
  }

  const handleApplyFilters = () => {
    if (!selectedLocation) return
    resetPage()
    setAllProducts([])
    refetch()
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setState({
      size: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    })
    resetPage()
    setAllProducts([])
    setTimeout(() => refetch(), 0)
    setShowFilters(false)
  }


  // console's for test
  // console.log('map route all products: ', allProducts)

  return (
    <section className="container mx-auto pt-1 pb-12">
      <h1 className="brand-header mb-4">
        Find Near You
      </h1>
      <p className="brand-subheader text-center mb-10 hidden md:block">
        FIND YOUR DRESS NEAR YOU FOR LOCAL PICK UP
      </p>

      {/* Search Bar / Location Selector */}
      <div className="mb-8">
        <AustraliaLocationSelector
          accessToken={mapboxtoken || ''}
          initialLocation={
            selectedLocation
              ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                placeName: selectedLocation.placeName,
                address: selectedLocation.placeName,
                country: 'Australia', //required field fix
                precision: 'exact',
              }
              : undefined
          }
          onLocationSelect={(data) => {
            setState({
              selectedLocation: {
                latitude: data.latitude,
                longitude: data.longitude,
                placeName: data.placeName,
              },
            })
            // Reset and search automatically
            resetPage()
            setAllProducts([])
            setTimeout(() => refetch(), 0) // Ensure state update is processed
          }}
          onSearch={handleSearchNearYou}
          placeholder="Search for your location..."
          mapHeight="300px"
        />
      </div>

      {/* Controls Row: Filters, View Toggle, and Radius */}
      <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-8 mb-10 px-2 md:px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 brand-button px-2 md:px-4 text-xs md:text-sm tracking-tighter md:tracking-normal h-8 md:h-10 shrink-0 uppercase"
          >
            <Filter size={12} className="md:size-4" />
            FILTERS{' '}
            {showFilters ? <ChevronUp size={12} className="md:size-4" /> : <ChevronDown size={12} className="md:size-4" />}
          </Button>
          <ViewToggle />
        </div>

        {/* Radius control in the same row */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none min-w-[120px] md:min-w-[300px]">
          <span className="brand-body whitespace-nowrap text-xs md:text-sm uppercase">
            Radius: <span className="font-medium">{radius}km</span>
          </span>
          <Slider
            value={[radius]}
            max={100}
            step={2}
            className="flex-1"
            onValueChange={(val) => setState({ radius: val[0] })}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
          <p className="brand-subheader mb-4">
            Filter Options
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[45px] lg:gap-[60px]">
            {/* Size */}
            <div>
              <Label className="brand-body text-black">Size</Label>
              <Select
                value={size || 'CLEAR'}
                onValueChange={(val) =>
                  setState({ size: val === 'CLEAR' ? '' : val })
                }
              >
                <SelectTrigger className="w-full border-b shadow-none rounded-none pt-5 pb-3 h-auto">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SM">SM</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label className="brand-body text-black">Category</Label>
              <Select
                value={category}
                onValueChange={(val) =>
                  setState({ category: val === 'Clear' ? '' : val })
                }
              >
                <SelectTrigger className="w-full border-b shadow-none rounded-none pt-5 pb-3 h-auto">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Cocktail">Cocktail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="w-full flex items-end gap-4">
              <div className="w-full">
                <Label className="brand-body text-black">
                  Price Range
                </Label>
                <div className="flex items-center gap-2 border-b border-black pb-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setState({ minPrice: e.target.value })}
                  />
                  <span className="text-2xl text-black px-2">—</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setState({ maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 brand-button border border-black hover:bg-black hover:text-white uppercase text-xs md:text-sm"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 brand-button border border-gray-300 text-gray-500 hover:bg-gray-100 uppercase text-xs md:text-sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}


      {/* Products */}
      {!isMapPage && allProducts.length > 0 && (
        <div className="mt-10">
          <ProductList products={allProducts} />
          {pagination && page < pagination.totalPages && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={isFetching}
                className="brand-button"
              >
                {isFetching ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {!isMapPage && (isLoading || isFetching) && (
        <div className="mt-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full h-40 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-6 flex items-center gap-2 text-red-600">
          <AlertCircle className="size-5" />
          <span>{(error as Error)?.message || 'Something went wrong'}</span>
        </div>
      )}

      {/* Initial Empty State (before selecting location) */}
      {!isMapPage && !isFetching && !isError && !selectedLocation && (
        <div className="mt-16 text-center space-y-5">
          <AlertCircle className="mx-auto mb-3 text-gray-400 size-24" />
          <h3 className="brand-subheader text-gray-700">
            Start by Selecting a Location
          </h3>
          <p className="brand-body text-gray-500 mt-1">
            Use the map above to choose a location and search for dresses near
            you.
          </p>
        </div>
      )}

      {/* No Results State (location selected but no products) */}
      {!isMapPage &&
        !isFetching &&
        allProducts.length === 0 &&
        !isError &&
        selectedLocation && (
          <div className="mt-16 text-center space-y-5">
            <AlertCircle className="mx-auto mb-3 text-gray-400 size-24" />
            <h3 className="brand-subheader text-gray-700">
              No Dresses Found
            </h3>
            <p className="brand-body text-gray-500 mt-1">
              Try adjusting your filters or increasing the radius.
            </p>
          </div>
        )}
    </section>
  )
}
