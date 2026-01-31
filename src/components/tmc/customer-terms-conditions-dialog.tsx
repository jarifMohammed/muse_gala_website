"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CustomerTermsConditionsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CustomerTermsConditionsDialog: React.FC<CustomerTermsConditionsProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-h-[90vh] md:pt-28 lg:max-w-5xl md:max-w-4xl max-w-sm overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-8">
            <div className=" text-center space-y-5">
              <h1 className="lg:text-[56px] md:text-4xl text-3xl font-normal md:tracking-[20px] uppercase">
                Customer
              </h1>
              <h1 className="lg:text-[56px] md:text-4xl text-3xl font-normal md:tracking-[20px] uppercase md:whitespace-nowrap">
                Terms & Conditions
              </h1>
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="space-y-8 flex  flex-col items-center">
          <div className="space-y-[60px]">
            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">
                1. Booking & Rental Agreemen
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  By placing a rental order on MUSE GALA, you agree to pay the
                  full rental price, platform fees, shipping costs, and
                  insurance.
                </li>
                <li>
                  You must book your rental at least 2 days in advance of your
                  event date.
                </li>
                <li>
                  You are responsible for selecting the correct rental dates,
                  size, and delivery or pickup option.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">2. Shipping & Delivery</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Outbound shipping is $10, paid at checkout.</li>
                <li>
                  Return shipping is included — we provide a prepaid return
                  label, which you must print and attach for return.
                </li>
                <li>
                  You are responsible for returning the item on or before the
                  agreed-upon return date. Late returns may incur additional
                  charges.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">3. Local Pickup Terms</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  If you select local pickup, you agree to either drop the item
                  back off or pay $10 for return shipping at checkout.
                </li>
                <li>
                  Try-ons are permitted at pickup. If the item is unsuitable,
                  you may swap the item or request a credit toward your next
                  rental. Refunds are not guaranteed.
                </li>
                <li>
                  Once the item has left the premises, the booking is confirmed
                  and considered non-refundable.
                </li>
              </ul>
            </section>
            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">4. Payment & Fees</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  In addition to the rental cost, the following charges apply:
                </li>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>$10 platform fee</li>
                  <li>$5 insurance</li>
                  <li>$10 outbound shipping</li>
                  <li>$15 for 5-day rentals (optional)</li>
                </ul>
                <li>
                  Payments are processed securely via our third-party payment
                  provider.
                </li>
              </ul>
            </section>
            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">5. ID Verification</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  You must verify your identity before your first rental to
                  protect both you and our lenders.
                </li>
                <li>
                  This process may involve submitting ID or completing a secure
                  digital verification step.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">
                6. Item Condition & Damage
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  Insurance covers minor wear (e.g., makeup or deodorant marks).
                </li>
                <li>
                  You are responsible for significant damage (tear, or loss). If
                  this occurs, we may charge the payment method on file for the
                  full replacement value.
                </li>
                <li>Do not attempt to clean or alter the item yourself.</li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">7. Returns & Swaps</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Return an item using the return shipping label.</li>
                <li>
                  Size swaps may result in late fees or need to rent a second
                  item if the first item is unavailable.
                </li>
                <li>
                  Late returns will incur a fee of $15 per day if the item is
                  unavailable.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">8. Disputes</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  If you receive the wrong item, or the item arrives damaged,
                  contact us within 24 hours of receipt.
                </li>
                <li>
                  Disputes will be handled by our platform support team in
                  collaboration with the lender.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerTermsConditionsDialog;
