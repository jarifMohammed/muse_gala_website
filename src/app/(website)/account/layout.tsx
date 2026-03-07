'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Headers from './_components/headers'
import { useUserStore } from '@/zustand/useUserStore'

interface LayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: LayoutProps) {
  const [tab, setTab] = useState('Account Info')
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUserStore()

  // Automatically set active tab based on route
  useEffect(() => {
    if (pathname.includes('/chats')) setTab('Chats')
    else if (pathname.includes('/dispute')) setTab('Dispute')
    else if (pathname.includes('/promo-codes')) setTab('Promo Codes')
    else setTab('Account Info')
  }, [pathname])

  // Route navigation based on selected tab
  useEffect(() => {
    // Only push if we are not already on the correct path to prevent infinite loops
    if (tab === 'Chats' && user?.kycVerified && !pathname.includes('/account/chats')) {
      router.push('/account/chats')
    } else if (tab === 'Dispute' && user?.kycVerified && !pathname.includes('/account/dispute')) {
      router.push('/account/dispute')
    } else if (tab === 'Promo Codes' && !pathname.includes('/account/promo-codes')) {
      router.push('/account/promo-codes')
    } else if (tab === 'Account Info' && pathname !== '/account') {
      router.push('/account')
    }
  }, [tab, router, user?.kycVerified, pathname])

  return (
    <div className="w-full pt-12 md:pt-16 lg:pt-20">
      <Headers setTab={setTab} tab={tab} user={user} />
      <div>{children}</div>
    </div>
  )
}
