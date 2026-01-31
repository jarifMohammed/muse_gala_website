"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LenderTermsConditionsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LenderTermsConditions: React.FC<LenderTermsConditionsProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-h-[90vh] md:pt-28 lg:max-w-5xl md:max-w-4xl max-w-sm overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-8">
            <div className=" text-center space-y-5">
              <h1 className="lg:text-[56px] md:text-4xl text-3xl font-normal md:tracking-[20px]">LENDER</h1>
              <h1 className="lg:text-[56px] md:text-4xl text-3xl font-normal md:tracking-[20px] md:whitespace-nowrap">
                TERMS & CONDITIONS
              </h1>
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="space-y-8 flex  flex-col items-center">
          <div className="space-y-[60px]">
            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">1. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  To list on MUSE GALA, you must be a registered business with a
                  minimum of 10 different items available for rent.
                </li>
                <li>
                  You must agree to keep your availability calendar updated and
                  respond to bookings promptly.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">2. Listings & Approval</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  All listings must be submitted for admin approval before going
                  live.
                </li>
                <li>
                  Dress descriptions, pricing, and availability must be
                  accurate.
                </li>
                <li>
                  Photos must be high quality and reflect the true state of the
                  item.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">
                3. Availability & Declines
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  If a dress is booked outside of the platform, you must
                  immediately update its availability on your dashboard.
                </li>
                <li>
                  If you are selected for an order, you must accept or decline
                  within 6 hours.
                </li>
                <li>
                  If declined, the booking is automatically reassigned to
                  another lender.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">4. Communication</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  You may only see the customer&apos;s first name and surname
                  initial.
                </li>
                <li>
                  You may contact them via the platform messaging system (e.g.,
                  for pickup coordination).
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">
                5. Fulfillment Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  For shipped orders, you are responsible for packaging and
                  dispatching the item promptly.
                </li>
                <li>
                  For local pickups, you must provide clear pickup instructions
                  and confirm return in the system once received back.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">6. Payouts</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  Payouts are processed fortnightly to your registered payment
                  method.
                </li>
                <li>
                  During the 0% commission launch period, no deductions will be
                  made (only for the rental of the item).
                </li>
                <li>
                  MUSE GALA may deduct insurance-related or dispute-based costs
                  if applicable.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">7. Disputes & Risk</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  If an item is returned damaged, or not returned at all, report
                  the issue via your dashboard.
                </li>
                <li>
                  MUSE GALA will mediate disputes and may charge the
                  customer&apos;s payment method on your behalf.
                </li>
                <li>
                  You must not request payment directly from the customer
                  outside of the platform.
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl  font-normal">8. Platform Usage</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>
                  You may not redirect customers away from MUSE GALA or
                  encourage off-platform bookings.
                </li>
                <li>Abuse of the platform may result in removal.</li>
              </ul>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LenderTermsConditions;
