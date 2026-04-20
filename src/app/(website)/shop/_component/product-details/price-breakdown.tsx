/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useShoppingStore } from '@/zustand/shopingStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/zustand/useUserStore'
import { useLocationStore } from '@/zustand/useLocationStore'
import { bookingApi } from '@/lib/bookingApiService'
import { paymentApi } from '@/lib/paymentApi'
import { useEffect, useRef } from 'react'
import { Loader2, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KycApiRes {
  status: boolean
  message: {
    url: string
    message: string
  }
}

interface ShippingDetails {
  isLocalPickup?: boolean
  isShippingAvailable?: boolean
}

interface ProductData {
  _id?: string
  masterDressId?: string
  dressName?: string
  basePrice?: number
  insuranceFee?: number
  shippingDetails?: ShippingDetails
  sizes?: string[]
  colors?: string[]
}

interface ShopDetailsProps {
  singleProduct: {
    data?: ProductData
  }
}

const PriceBreakDown = ({ singleProduct }: ShopDetailsProps) => {
  const {
    rent,
    isConfirm,
    setIsConfirm,
    startDate,
    endDate,
    deliveryOption,
    selectedSize,
    selectedColor,
    fullName,
    email,
    phone,
    address,
    setBookingSummary,
    currentBookingId,
    setCurrentBookingId,
    promoCode,
    setPromoCode,
    appliedPromo,
    setAppliedPromo,
    clearPromoCode,
  } = useShoppingStore()

  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const router = useRouter()
  const pathName = usePathname()

  const data = singleProduct?.data

  const { user } = useUserStore()
  const isKycVerified =
    user?.kycVerified === true &&
    user?.kycStatus?.toLowerCase() === 'verified'

  const { lenders } = useLocationStore()

  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [showKycSection, setShowKycSection] = useState(false)
  const hasOpenedKycRef = useRef(false)
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const {
    data: kycRes,
    refetch: fetchKyc,
    isFetching: isFetchingKyc,
  } = useQuery<KycApiRes>({
    queryKey: ['kyc-check-inline'],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/kyc/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('ID verification failed')
      return res.json()
    },
    enabled: false,
  })

  useEffect(() => {
    if (kycRes?.status && kycRes.message?.url && !hasOpenedKycRef.current) {
      hasOpenedKycRef.current = true
      window.open(kycRes.message.url, '_blank')
      setShowKycSection(false)
    }
  }, [kycRes])

  // PRICE CALCULATION
  const basePrice = Number(data?.basePrice ?? 0)
  const displayPrice = rent === '8' ? basePrice + 15 : basePrice

  const insurance = Number(data?.insuranceFee ?? 0)
  const shippingAvailable = data?.shippingDetails?.isShippingAvailable
  const localPickup = data?.shippingDetails?.isLocalPickup

  const shippingCost =
    deliveryOption === 'shipping' && shippingAvailable ? 14.95 : 0

  // Calculate subtotal first
  const subtotal = displayPrice + insurance + shippingCost

  // Calculate discount based on type
  let discount = 0
  if (appliedPromo) {
    if (appliedPromo.discountType.toUpperCase() === 'FLAT') {
      // Flat discount - direct amount
      discount = Number(appliedPromo.discountValue)
    } else if (appliedPromo.discountType === 'PERCENTAGE') {
      // Percentage discount - calculate from subtotal
      discount = (subtotal * Number(appliedPromo.discountValue)) / 100
    }
  }

  console.log('discount and promocode', appliedPromo, discount)

  // Final total - ensure it doesn't go below 0
  const total = Math.max(0, subtotal - discount)

  // FORMAT DATES FOR API
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // FORMAT DATES FOR DISPLAY
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // VALIDATE PROMO CODE
  const handleApplyPromo = async () => {
    if (!token) {
      toast.error('Please login to apply promo code')
      return
    }

    if (!promoCode.trim()) {
      toast.error('Please enter a promo code')
      return
    }

    setIsApplyingPromo(true)

    try {
      const response = await bookingApi.validatePromoCode(
        { promoCode: promoCode.trim() },
        token,
      )

      if (response.status && response.data) {
        setAppliedPromo(response.data)
        toast.success(response.message || 'Promo code applied successfully!', {
          position: 'bottom-right',
        })
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid promo code', {
        position: 'bottom-right',
      })
      clearPromoCode()
    } finally {
      setIsApplyingPromo(false)
    }
  }

  // CREATE BOOKING (for Rent Now button - shop page)
  const createBookingForRentNow = useMutation({
    mutationFn: async () => {
      const bookingData: any = {
        masterdressId: data?._id,
        rentalStartDate: formatDate(startDate),
        rentalEndDate: formatDate(endDate),
        rentalDurationDays: rent === '4' ? 4 : 8,
        size: selectedSize,
        color: selectedColor,
        deliveryMethod: deliveryOption === 'shipping' ? 'Shipping' : 'Pickup',
      }

      // Add promo code if applied
      if (appliedPromo) {
        bookingData.promoCode = appliedPromo.code
      }

      // Add pickup-specific fields
      if (deliveryOption === 'pickup' && lenders.length > 0) {
        bookingData.tryOnRequested = true
        bookingData.selectedLender = [
          {
            _id: lenders[0]._id,
            email: lenders[0].email,
            location: {
              type: lenders[0].location.type,
              coordinates: lenders[0].location.coordinates,
            },
            distance: lenders[0].distance,
          },
        ]
      }

      return await bookingApi.createBooking(bookingData, token!)
    },
    onSuccess: res => {
      const bookingId = res?.data?.id

      if (!bookingId) {
        toast.error('No booking ID returned')
        return
      }

      setCurrentBookingId(bookingId)

      setTimeout(() => {
        router.push(`/shop/checkout/${data?._id}`)
      }, 1000)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Booking failed', { position: 'bottom-right' })
    },
  })

  // UPDATE BOOKING (for Confirm & Pay button - checkout page)
  const updateBookingForPayment = useMutation({
    mutationFn: async () => {
      if (!currentBookingId) {
        throw new Error('No booking ID found. Please create a booking first.')
      }

      const updateData: any = {
        rentalStartDate: formatDate(startDate),
        rentalEndDate: formatDate(endDate),
        rentalDurationDays: rent === '4' ? 4 : 8,
        size: selectedSize,
        color: selectedColor,
        deliveryMethod: deliveryOption === 'shipping' ? 'Shipping' : 'Pickup',
        address: address,
        phone: phone,
      }

      // Add promo code if applied
      if (appliedPromo) {
        updateData.promoCode = appliedPromo.code
      }

      // Add pickup-specific fields
      if (deliveryOption === 'pickup' && lenders.length > 0) {
        updateData.tryOnRequested = true
        updateData.selectedLender = [
          {
            _id: lenders[0]._id,
            email: lenders[0].email,
            location: {
              type: lenders[0].location.type,
              coordinates: lenders[0].location.coordinates,
            },
            distance: lenders[0].distance,
          },
        ]
      }

      return await bookingApi.updateBooking(
        currentBookingId,
        updateData,
        token!,
      )
    },
    onSuccess: () => {
      setBookingSummary({
        orderId: currentBookingId || 'N/A',
        dressName: data?.dressName || 'N/A',
        rentalStartDate: formatDisplayDate(startDate),
        rentalEndDate: formatDisplayDate(endDate),
        deliveryMethod:
          deliveryOption === 'shipping' ? 'Shipping' : 'Local Pickup',
        totalPaid: total,
        size: selectedSize || 'N/A',
      })

      createCheckout.mutate()
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update booking', {
        position: 'bottom-right',
      })
    },
  })

  // SAVE PAYMENT INFO (redirect to card info page)
  const createCheckout = useMutation({
    mutationFn: async () => {
      return await paymentApi.savePaymentInfo(token!)
    },
    onSuccess: res => {
      const url = res?.data?.url
      if (url) {
        window.location.href = url
      } else {
        toast.error('Payment setup failed, try again later')
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Payment setup failed', {
        position: 'bottom-right',
      })
    },
  })

  // HANDLERS
  const handleCheckout = () => {
    if (!token) {
      toast.error('You must be signed in to continue!')
      setTimeout(() => router.push('/signin'), 2000)
      return
    }

    if (user && !isKycVerified) {
      setShowKycSection(true)
      return
    }

    if (!fullName || !email || !phone || !address) {
      toast.error('Please complete all required fields!')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental dates!')
      return
    }

    if (!selectedSize) {
      toast.error('Please select a size!')
      return
    }

    if (deliveryOption === 'pickup' && lenders.length === 0) {
      toast.error('No nearby lenders found. Please choose shipping instead.')
      return
    }

    setIsConfirm(true)
  }

  const handleConfirmPay = () => {
    if (updateBookingForPayment.isPending || createCheckout.isPending) return

    if (!currentBookingId) {
      toast.error('No booking ID found. Please try again.')
      return
    }
    updateBookingForPayment.mutate()
  }

  const handleRentNow = () => {
    if (!token) {
      toast.error('Please login to continue.', {
        position: 'bottom-right',
      })

      setTimeout(() => {
        router.push('/login')
      }, 1000)

      return
    }

    if (user && !isKycVerified) {
      setShowKycSection(true)
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental dates!')
      return
    }

    if (!selectedSize) {
      toast.error('Please select a size!')
      return
    }

    if (deliveryOption === 'pickup' && lenders.length === 0) {
      toast.error('No nearby lenders found. Please choose shipping instead.')
      return
    }

    if (createBookingForRentNow.isPending) return

    createBookingForRentNow.mutate()
  }

  // UI
  return (
    <div className="font-avenir uppercase mt-10">
      <h1 className="opacity-75 tracking-widest border-b border-black pb-1">
        Subtotal
      </h1>

      <div className="mt-4">
        <div className="space-y-3 text-sm border-b border-black pb-2">
          <div className="flex items-center justify-between opacity-75 tracking-widest">
            <span>
              Rental Fee{' '}
              {rent === '8' && <span className="text-xs">(8 days +$15)</span>}
            </span>
            <span>${displayPrice}</span>
          </div>

          <div className="flex items-center justify-between opacity-75 tracking-widest">
            <span>Care &amp; Protection</span>
            <span>${insurance}</span>
          </div>

          {deliveryOption === 'shipping' && shippingAvailable && (
            <div className="flex items-center justify-between opacity-75 tracking-widest">
              <span>Shipping</span>
              <span>${shippingCost}</span>
            </div>
          )}

          {deliveryOption === 'pickup' && localPickup && (
            <div className="flex items-center justify-between opacity-75 tracking-widest">
              <span>Pickup</span>
              <span>Free</span>
            </div>
          )}

          {appliedPromo && discount > 0 && (
            <div className="flex items-center justify-between tracking-widest text-green-600">
              <span className="uppercase text-xs">
                Discount ({appliedPromo.code})
              </span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between opacity-75 tracking-widest font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* PROMO CODE INPUT */}
        <div className="mt-6">
          <label className="block text-sm tracking-widest opacity-75 mb-2">
            Promo Code
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              disabled={!!appliedPromo || isApplyingPromo}
              className="flex-1 bg-transparent  tracking-widest text-sm focus:ring-1 focus:ring-black h-10 font-avenir"
            />
            {appliedPromo ? (
              <button
                onClick={clearPromoCode}
                className="px-4 py-2 border border-red-700 text-red-700 rounded-sm text-sm tracking-widest uppercase hover:bg-red-50 transition-colors font-avenir"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyPromo}
                disabled={isApplyingPromo || !promoCode.trim()}
                className="px-4 py-2 border border-black text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-avenir"
              >
                {isApplyingPromo ? 'Applying...' : 'Apply'}
              </button>
            )}
          </div>
        </div>


      </div>

      <div className="mt-10">
        {pathName?.startsWith('/shop/checkout') &&
          !pathName.includes('/confirmation') ? (
          <div>
            {isConfirm ? (
              <button
                onClick={handleConfirmPay}
                disabled={
                  updateBookingForPayment.isPending || createCheckout.isPending
                }
                className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors disabled:opacity-50 font-avenir rounded-none"
              >
                {updateBookingForPayment.isPending || createCheckout.isPending
                  ? 'Processing'
                  : 'Confirm & Pay'}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors font-avenir rounded-none"
              >
                Confirm & Pay
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleRentNow}
            disabled={createBookingForRentNow.isPending}
            className="bg-black text-white hover:bg-black/80 uppercase tracking-widest text-sm h-12 w-full transition-colors disabled:opacity-50 font-avenir rounded-none"
          >
            {createBookingForRentNow.isPending ? 'Processing' : 'Rent Now'}
          </button>
        )}
      </div>

      {showKycSection && user && isKycVerified === false && (
        <div className="mt-8 p-6 border border-black/10 bg-gray-50/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 relative">
          <button
            onClick={() => setShowKycSection(false)}
            className="absolute right-4 top-4 opacity-40 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-black/60" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wider uppercase">ID Verification Required</h3>
              <p className="text-xs normal-case opacity-70 leading-relaxed font-light">
                Almost there. Before you rent, we just need a quick ID verification to ensure a safe community.
              </p>
            </div>
          </div>

          <Button
            onClick={() => fetchKyc()}
            disabled={isFetchingKyc}
            className="w-full bg-black text-white hover:bg-black/90 uppercase tracking-widest text-xs h-12 rounded-none transition-all"
          >
            {isFetchingKyc ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              'Verify Now'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PriceBreakDown
