/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { MapPin, Truck } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import Image from 'next/image'
import {
  ProductCardData,
  normalizeProducts,
} from '../find-near-you/utility/normalizeProducts'
import Link from 'next/link'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your-mapbox-token-here'

interface Marker {
  lat: number
  lng: number
  title?: string
  products?: ProductCardData[]
}

const CustomMarker = ({
  active,
}: {
  active?: boolean
}) => (
  <div
    className="flex flex-col items-center justify-center cursor-pointer"
    style={{ transform: 'translateY(-100%)' }}
  >
    <MapPin
      size={30}
      className={`text-[#800000] transition-all ${active ? 'scale-110 fill-white' : 'fill-white'
        }`}
    />
  </div>
)

const ProductPopover = ({
  products,
  position,
  onClose,
  isMobile,
  onOpenDrawer,
}: {
  products?: ProductCardData[]
  position: { top: number; left: number }
  onClose: () => void
  isMobile?: boolean
  onOpenDrawer?: () => void
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (!products || products.length === 0) return null

  const openDownwards = position.top < 360

  return (
    <div
      ref={popoverRef}
      onClickCapture={(e) => {
        if (isMobile && onOpenDrawer) {
          e.preventDefault()
          e.stopPropagation()
          onOpenDrawer()
        }
      }}
      className={`absolute z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-y-auto cursor-pointer ${isMobile ? 'w-[340px] max-h-[200px]' : 'w-[540px] max-h-[380px]'
        }`}
      style={{
        top: openDownwards ? `${position.top + 10}px` : `${position.top - 35}px`,
        left: `${position.left}px`,
        transform: openDownwards ? 'translateX(-50%)' : 'translateX(-50%) translateY(-100%)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50/90 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="font-medium text-sm text-gray-800">
          {products.length} Dresses Available
        </h3>
      </div>

      {/* Scrollable content */}
      <div className={`p-4 font-avenir grid gap-4 ${products.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {products.map((product) => (
          <Link key={product.id} href={`/shop/${product.name}`}>
            <div
              className={`flex ${products.length > 1 ? 'flex-col' : 'flex-row'} items-start gap-4 p-3 hover:shadow-md bg-white border border-gray-100 rounded-lg transition-all h-full`}
            >
              {/* Image */}
              <div className={`${products.length > 1 ? 'w-full h-48' : 'w-32 h-32'} relative flex-shrink-0 bg-gray-50 rounded-md overflow-hidden`}>
                <Image
                  src={
                    product?.image ||
                    (product as any)?.media?.[0] ||
                    '/images/dress.png'
                  }
                  alt={
                    product?.name ??
                    (product as any)?.dressName ??
                    'Product image'
                  }
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between uppercase tracking-[.05em] w-full">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product?.name ?? (product as any)?.dressName ?? 'Untitled'}
                  </div>

                  <div className="text-xs text-gray-500">
                    Size:{' '}
                    {Array.isArray(product?.size)
                      ? product.size.join(', ')
                      : product?.size || 'N/A'}
                  </div>

                  {/* Shipping & Pickup */}
                  <div className={`flex ${products.length > 1 ? 'flex-wrap' : 'flex-row'} items-center gap-[10px] text-xs text-gray-700`}>
                    {product?.shipping && (
                      <div className="flex items-center gap-[6px] capitalize bg-gray-50 px-2 py-1 rounded">
                        <Truck width={14} height={14} />
                        <span className="text-[10px] font-medium tracking-wider">SHIPPING</span>
                      </div>
                    )}

                    {product?.pickup && (
                      <div className="flex items-center gap-[6px] bg-gray-50 px-2 py-1 rounded">
                        <MapPin width={14} height={14} />
                        <span className="text-[10px] font-medium tracking-wider">PICKUP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface FindNearMapProps {
  products?: ProductCardData[]
  center?: [number, number]
  zoom?: number
  width?: string | number
  height?: string | number
}

const FindNearMap = ({
  products = [],
  center = [151.2093, -33.8688],
  zoom = 12,
  width = '100%',
  height = 400,
}: FindNearMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null)
  const [drawerMarker, setDrawerMarker] = useState<Marker | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Screen size detection
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // normalize and group markers
  const markersData = useMemo(() => {
    const normalizedProducts = normalizeProducts(products as any)
    const markersMap = new Map<string, Marker>()
    normalizedProducts
      .filter((p) => p.latitude && p.longitude)
      .forEach((p) => {
        const key = `${p.latitude},${p.longitude}`
        if (!markersMap.has(key)) {
          markersMap.set(key, {
            lat: p.latitude,
            lng: p.longitude,
            title: p.name,
            products: [p],
          })
        } else {
          markersMap.get(key)!.products!.push(p)
        }
      })
    return Array.from(markersMap.values())
  }, [products])

  const handleMarkerHover = useCallback((marker: Marker) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (map.current) {
      const point = map.current.project([marker.lng, marker.lat])
      setPopoverPosition({ top: point.y - 35, left: point.x })
      setActiveMarker(marker)
    }
  }, [])

  const closePopover = useCallback(() => {
    if (isMobile) {
      setActiveMarker(null)
      return
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setActiveMarker(null)
    }, 200)
  }, [isMobile])

  const handlePopoverEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: center,
        zoom: zoom,
        maxZoom: 15,
        attributionControl: false,
      })
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.on('click', () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        setActiveMarker(null)
      })
    } catch (err) {
      console.error('Map initialization error:', err)
    }
    return () => {
      map.current?.remove()
      map.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update Markers and Auto-Focus
  useEffect(() => {
    if (!map.current) return
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    markersData.forEach((marker: Marker) => {
      const markerElement = document.createElement('div')
      markerElement.innerHTML = ReactDOMServer.renderToString(
        <CustomMarker
          active={
            activeMarker?.lat === marker.lat &&
            activeMarker?.lng === marker.lng
          }
        />
      )

      markerElement.addEventListener('mouseenter', (e) => {
        e.stopPropagation()
        handleMarkerHover(marker)
      })

      markerElement.addEventListener('mouseleave', () => {
        closePopover()
      })

      markerElement.addEventListener('click', (e) => {
        e.stopPropagation()
        if (isMobile) {
          handleMarkerHover(marker)
        }
      })

      const newMarker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom',
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!)
      markersRef.current.push(newMarker)
    })

    if (markersData.length > 0) {
      if (markersData.length === 1) {
        map.current.flyTo({
          center: [markersData[0].lng, markersData[0].lat],
          zoom: 14,
          essential: true,
        })
      } else {
        const bounds = new mapboxgl.LngLatBounds()
        markersData.forEach((marker: Marker) => bounds.extend([marker.lng, marker.lat]))
        map.current.fitBounds(bounds, { padding: 80, maxZoom: 14, essential: true })
      }
    } else if (center) {
      map.current.flyTo({ center: center, zoom: 12, essential: true })
    }
  }, [markersData, center, handleMarkerHover, closePopover, isMobile, activeMarker])

  return (
    <div
      className="relative"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg shadow-lg bg-gray-200 relative"
      />

      {activeMarker && (
        <div
          onMouseEnter={handlePopoverEnter}
          onMouseLeave={closePopover}
          onClick={(e) => e.stopPropagation()}
        >
          <ProductPopover
            products={activeMarker.products}
            position={popoverPosition}
            onClose={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
              setActiveMarker(null)
            }}
            isMobile={isMobile}
            onOpenDrawer={() => setDrawerMarker(activeMarker)}
          />
        </div>
      )}

      <Drawer open={!!drawerMarker} onOpenChange={(open) => !open && setDrawerMarker(null)}>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader className="border-b shrink-0">
            <DrawerTitle className="text-center font-avenir font-normal">
              {drawerMarker?.products?.length} Dresses Available
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-8">
            <div className="divide-y divide-gray-100">
              {drawerMarker?.products?.map((product) => (
                <Link key={product.id} href={`/shop/${product.name}`}>
                  <div className="flex items-center gap-4 py-4 bg-white/50 hover:bg-white transition-colors">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={product?.image || (product as any)?.media?.[0] || '/images/dress.png'}
                        alt={product?.name || 'Dress'}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 uppercase tracking-wider">
                      <div className="text-sm font-light text-gray-800 line-clamp-1">{product.name}</div>
                      <div className="text-[10px] text-gray-500 mt-1">Size: {product.size}</div>
                      <div className="flex items-center gap-3 mt-2 text-[10px]">
                        {product.shipping && <div className="flex items-center gap-1.5"><Truck size={14} /><span>SHIPPING</span></div>}
                        {product.pickup && <div className="flex items-center gap-1.5"><MapPin size={14} /><span>PICKUP</span></div>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default FindNearMap
