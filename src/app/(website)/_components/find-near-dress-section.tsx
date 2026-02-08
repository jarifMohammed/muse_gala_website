import { cn } from "@/lib/utils";
import Link from "next/link";
import FindNearMap from "./find-near-map";

const FindNearDressSection = () => {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-[1800px] mx-auto px-2 md:px-4 lg:px-6 py-20">
      {/* Text content section */}
      <div className="flex flex-col justify-center w-full md:w-[35%] mb-8 md:mb-0 md:pr-12 lg:pr-20">
        <div>
          <h1 className={cn("headerClass !text-left")}>FIND YOUR DRESS NEAR YOU</h1>
          <p className="text-[14px] opacity-75 my-8 tracking-wider leading-relaxed">
            Discover rentals ready for pick up. Real time availability.
          </p>
          <Link
            href="/find-near-you"
            className="inline-block border-b border-black py-2 text-[14px] uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            <button className="opacity-80 font-avenir tracking-[0.3rem]">EXPLORE NEARBY DRESSES</button>
          </Link>
        </div>
      </div>

      {/* Map section */}
      <div className="w-full md:w-[65%]">
        <FindNearMap height={600} />
      </div>
    </div>
  );
};

export default FindNearDressSection;
