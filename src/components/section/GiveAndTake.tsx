import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function GiveAndTake() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h2 className="headerClass uppercase">GET $10, GIVE $10</h2>
      <p className="text-[12px] mb-8 max-w-3xl !normal-case mx-auto font-avenir font-light">
        Get $10 off your first rental when you join. Share your code and give
        friends $10 too.
      </p>

      <div className="flex relative flex-col sm:flex-row justify-center items-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="YOUR EMAIL"
          className="border border-t-0 border-l-0 border-r-0 border-[#000000] px-2 py-[10px] mb-4 sm:mb-0 sm:flex-1 outline-none font-avenir font-light"
        />
        <Button
          variant="ghost"
          size="icon"
          className="ml-0 absolute right-0 sm:ml-2"
        >
          <ArrowRight className="h-5 w-6" />
        </Button>
      </div>
    </div>
  );
}
