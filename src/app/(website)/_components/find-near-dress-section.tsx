'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import FindNearMap from "./find-near-map";
import { useQuery } from "@tanstack/react-query";

const FindNearDressSection = () => {
  const { data } = useQuery({
    queryKey: ['homepage-approved-dresses'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/`)
      if (!res.ok) throw new Error('Failed to fetch approved dresses')
      return res.json()
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const products = data?.data || []

  return (
    <div className="flex flex-col md:flex-row w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
      {/* Text content section */}
      <div className="flex flex-col justify-center w-full md:w-[35%] mb-8 md:mb-0 md:pr-12 lg:pr-20">
        <div>
          <h1 className={cn("headerClass !text-left uppercase")}>Find Your Dress Near You</h1>
          <p className="text-[14px] opacity-75 my-8 tracking-wider leading-relaxed font-avenir font-light">
            Discover rentals ready for pick up. Real time availability.
          </p>
          <Link
            href="/find-near-you"
            className="inline-block text-[14px] uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            <button className="opacity-80 font-avenir tracking-[0.3rem] py-2">
              <span className="border-b border-black">Explore nearby dresses</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Map section */}
      <div className="w-full md:w-[65%]">
        <FindNearMap
          height={450}
          products={products}
          center={[144.9631, -37.8136]} // Default to Melbourne or something sensible for AU
          zoom={3} // Zoom out to show Australia if showing all
        />
      </div>
    </div>
  );
};

export default FindNearDressSection;
