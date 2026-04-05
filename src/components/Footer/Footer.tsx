'use client'
import { ArrowRight, Instagram, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '../ui/button'

const Footer = () => {
  const [email, setEmail] = useState('')

  const { mutate, isPending } = useMutation({
    mutationKey: ['newsletter-subscription-footer'],
    mutationFn: async () => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address')
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletterSubscription/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: '',
            lastName: '',
            email,
            phoneNumber: '',
          }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.status) throw new Error(data.message || 'Failed to subscribe')
      return data
    },
    onSuccess: () => {
      toast.success('Thank you for subscribing')
      setEmail('')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  return (
    <footer className="w-full bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* CUSTOMER SECTION */}
          <div className="space-y-4">
            <h3 className="brand-subheader">CUSTOMER</h3>
            <nav className="flex flex-col space-y-2 brand-body">
              <Link
                href="/how-it-works/#faq"
                className="text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How It Works
              </Link>
              <Link
                href="/contact-us"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact Us
              </Link>
              <Link
                href="/refund-policy"
                className="text-gray-600 hover:text-gray-900"
              >
                Refund Policy
              </Link>
              <Link
                href="/insurance-policy"
                className="text-gray-600 hover:text-gray-900"
              >
                Insurance Policy
              </Link>
              <Link
                href="/dispute-resolution-policy"
                className="text-gray-600 hover:text-gray-900"
              >
                Dispute Resolution Policy
              </Link>
            </nav>
          </div>

          {/* LENDERS SECTION */}
          <div className="space-y-4">
            <h3 className="brand-subheader">LENDERS</h3>
            <nav className="flex flex-col space-y-2 brand-body">
              <Link
                href="/become-lender"
                className="text-gray-600 hover:text-gray-900"
              >
                Become a Lender
              </Link>
              <Link
                href="lender-faq"
                className="text-gray-600 hover:text-gray-900"
              >
                Lender FAQ
              </Link>
              <Link
                href="https://lender.musegala.com.au"
                className="text-gray-600 hover:text-gray-900"
              >
                Lender Login
              </Link>
              <Link
                // onClick={() => setOpne(true)}
                href="lender-terms-and-conditions"
                className="text-gray-600 hover:text-gray-900"
              >
                Lender Terms & Conditions
              </Link>
              {/* <LenderTermsConditions open={open} setOpen={setOpne} /> */}
            </nav>
          </div>

          {/* COMPANY SECTION */}
          <div className="space-y-4">
            <h3 className="brand-subheader">COMPANY</h3>
            <nav className="flex flex-col space-y-2 brand-body">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-600 hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="terms-and-conditions"
                className="text-gray-600 hover:text-gray-900"
              >
                Terms & Conditions
              </Link>
              {/* <CustomerTermsConditionsDialog open={open1} setOpen={setOpne1} /> */}
              <Link
                href="/dispute-resolution"
                className="text-gray-600 hover:text-gray-900"
              >
                Dispute Resolution
              </Link>
              <Link
                href="/refund-policy"
                className="text-gray-600 hover:text-gray-900"
              >
                Refund Policy
              </Link>
            </nav>
          </div>

          {/* STAY CONNECTED SECTION */}
          <div className="space-y-4">
            <h3 className="brand-subheader">
              STAY CONNECTED
            </h3>
            <div className="flex space-x-4 ">
              <Link
                href="https://www.instagram.com/musegala/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-600 hover:text-gray-900"
              >
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
            <div className="space-y-2">
              <p className="brand-body text-gray-600">
                Subscribe to our newsletter
              </p>
              <div className="flex relative flex-col sm:flex-row justify-center items-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border brand-body border-t-0 border-l-0 border-r-0 border-[#000000] px-2 py-[10px] mb-4 sm:mb-0 sm:flex-1 outline-none font-avenir font-light"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-0 absolute right-0 sm:ml-2"
                  onClick={() => mutate()}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-6 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-6" />
                  )}
                </Button>
              </div>
              <p className="brand-body text-gray-500">
                By subscribing, you agree to our{' '}
                <Link href="#" className="text-gray-700 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* LOGO AND PAYMENT METHODS */}
        <div className="mt-12 flex flex-col items-center justify-between space-y-12 pt-8 md:flex-row md:space-y-0 relative pb-10">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex space-x-4">
              <Image
                src="/images/footer/amex.svg"
                alt="Mastercard"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/apple.svg"
                alt="American Express"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/gpay.svg"
                alt="Apple Pay"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
              <Image
                src="/images/footer/payoneer.svg"
                alt="Google Pay"
                width={30}
                height={30}
                className="h-5 w-auto"
              />
            </div>
          </div>

          <div className="flex flex-col items-center md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 my-5 w-full md:w-max">
            <div>
              <Image
                src={'/logo-black.svg'}
                width={300}
                height={300}
                alt="logo"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="brand-subheader tracking-[10px] md:tracking-[20px] whitespace-nowrap">MUSE GALA</span>
            </div>
          </div>
          <div className="hidden md:block w-[120px]"></div>
        </div>
      </div>
      <p className="text-center border-t border-gray-600 py-4 brand-body font-avenir font-light">
        © MUSE GALA 2025
      </p>
    </footer>
  )
}

export default Footer
