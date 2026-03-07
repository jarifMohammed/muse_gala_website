'use client'

import React from 'react'
import ShoppinghMap from '../shopping-map'
import { useLocationStore } from '@/zustand/useLocationStore'
import { useShoppingStore } from '@/zustand/shopingStore'

interface DeliveryOptionProps {
  masterDressId: string
}

const DeliveryOption = ({ masterDressId }: DeliveryOptionProps) => {
  const { deliveryOption, setDeliveryOption } = useShoppingStore()
  const { setLocation, setLenders, setLoading } = useLocationStore()

  React.useEffect(() => {
    // If the persisted state already has 'pickup', we need to fetch the nearby lenders
    // automatically rather than waiting for the user to click the button again.
    if (deliveryOption === 'pickup') {
      handleLocalPickup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLocalPickup = () => {
    console.log('📍 handleLocalPickup triggered')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log('📍 geolocation accessed successfully', pos.coords)
        setLoading(true)

        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        setLocation(lat, lng)

        try {
          const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/lenders/nearby/${masterDressId}?latitude=${lat}&longitude=${lng}`
          console.log('📍 Fetching URL:', url)

          const res = await fetch(url)
          const result = await res.json()
          console.log('📍 Fetch Result:', result)

          if (result.success) {
            setLenders(result.data)
          } else {
            setLenders([])
          }
        } catch (error) {
          console.error('Nearby API Error:', error)
          setLenders([])
        }

        setLoading(false)
      },
      (error) => {
        console.error('📍 geolocation error:', error)

        // Prevent alert if we somehow already got the location 
        // (Sometimes browsers fire both callbacks erroneously or due to cached permissions)
        const { latitude, longitude } = useLocationStore.getState()
        if (latitude && longitude) {
          console.log('📍 Ignored error because we already have the location coordinates.')
          return
        }

        // alert('Please allow location access for Local Pickup.')
        setDeliveryOption('shipping')
      }
    )
  }

  return (
    <div className="font-avenir uppercase mt-10">
      <h1 className="opacity-75 tracking-widest border-b border-black pb-1">
        Delivery Option
      </h1>

      {/* Option Buttons */}
      <div className="mt-8 opacity-75 flex items-center gap-5">
        {/* SHIPPING BTN */}
        <button
          onClick={() => setDeliveryOption('shipping')}
          className={`w-1/2 pb-2 uppercase tracking-widest ${deliveryOption === 'shipping'
            ? 'border-b-2 border-black'
            : 'border-b-2 border-white'
            }`}
        >
          Shipping
        </button>

        {/* LOCAL PICKUP BTN */}
        <button
          onClick={() => {
            setDeliveryOption('pickup')
            handleLocalPickup()
          }}
          className={`w-1/2 pb-2 uppercase tracking-widest ${deliveryOption === 'pickup'
            ? 'border-b-2 border-black'
            : 'border-b-2 border-white'
            }`}
        >
          Local Pickup
        </button>
      </div>

      {/* Description / Map */}
      <div>
        {deliveryOption === 'shipping' ? (
          <div className="pt-5 md:pt-10" />
        ) : (
          <div className="pt-5 w-full">
            <ShoppinghMap />
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryOption
