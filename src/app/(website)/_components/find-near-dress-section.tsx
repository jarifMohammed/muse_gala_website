import { cn } from "@/lib/utils";
import Link from "next/link";
import FindNearMap from "./find-near-map";

const FindNearDressSection = () => {
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
        <FindNearMap height={300} />
      </div>
    </div>
  );
};

export default FindNearDressSection;
