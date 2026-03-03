'use client'
import React from 'react'
import ProductDetails from '../_component/product-details/product-details'
import DocumentVerification from '../../account/_components/document-verification'
import { useUserStore } from '@/zustand/useUserStore'

const Page = () => {
  const { user } = useUserStore()

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 pb-24 pt-[80px] md:pt-[110px]">
      <div className="my-2 md:my-5">
        <DocumentVerification user={user} />
      </div>
      <ProductDetails />
    </div>
  )
}

export default Page
