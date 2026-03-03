"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List } from "lucide-react";

export default function ViewToggle() {
  const pathname = usePathname();
  const isMapView = pathname === "/find-near-you/map";

  return (
    <div className="flex justify-center brand-body text-black uppercase">
      {isMapView ? (
        <Link
          href="/find-near-you"
          className="flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 brand-button text-xs md:text-sm tracking-tighter md:tracking-normal whitespace-nowrap h-8 md:h-10 uppercase"
        >
          <List size={14} className="md:size-4" />
          LIST / MAP
        </Link>
      ) : (
        <Link
          href="/find-near-you/map"
          className="flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 brand-button text-xs md:text-sm tracking-tighter md:tracking-normal whitespace-nowrap h-8 md:h-10 uppercase"
        >
          <Map size={14} className="md:size-4" />
          LIST / MAP
        </Link>
      )}
    </div>
  );
}
