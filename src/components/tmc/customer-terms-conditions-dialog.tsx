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
                Terms &
              </h1>
              <h1 className="lg:text-[56px] md:text-4xl text-3xl font-normal md:tracking-[20px] uppercase md:whitespace-nowrap">
                Conditions
              </h1>
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="space-y-8 flex flex-col items-center">
          <div className="space-y-[60px] w-full max-w-3xl">
            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Overview
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  These Terms & Conditions govern your use of the Muse Gala
                  platform. By creating an account or placing a booking, you
                  agree to comply with these terms.
                </p>
                <p>
                  Muse Gala operates as a platform connecting customers with
                  lenders. All bookings, payments, and disputes are managed
                  through Muse Gala to ensure a consistent and reliable
                  experience.
                </p>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                User Accounts
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  A User Account refers to any registered account on Muse Gala,
                  including both:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customers (renters)</li>
                  <li>Lenders (item providers)</li>
                </ul>
                <p>Users are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>maintaining accurate account information</li>
                  <li>keeping login details secure</li>
                  <li>all activity conducted under their account</li>
                </ul>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Bookings
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>All bookings are subject to availability and confirmation</li>
                <li>Full payment is required at the time of booking</li>
                <li>Once confirmed, bookings are subject to the Refund Policy</li>
                <li>
                  Muse Gala reserves the right to:
                  <ul className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>cancel or adjust bookings where necessary</li>
                    <li>reassign bookings to alternative lenders</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Cancellations & Fulfilment
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>Customer cancellations are governed by the Refund Policy</li>
                <li>
                  Lenders do not have a cancellation option and must use “Can’t
                  Fulfil” where applicable
                </li>
                <li>
                  If a lender selects “Can’t Fulfil”:
                  <ul className="list-[circle] pl-6 mt-2 space-y-1">
                    <li>the booking will be sent to admin for reassignment</li>
                    <li>
                      if no replacement is found, a refund or alternative
                      resolution will be provided
                    </li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Lender Responsibilities
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>Lenders agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>provide accurate descriptions, sizing, and images</li>
                  <li>ensure items are clean, wearable, and as described</li>
                  <li>fulfil bookings within the required timeframe</li>
                  <li>
                    provide shipping and tracking details where applicable
                  </li>
                </ul>
                <p>Failure to meet these standards may result in:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>reduced visibility</li>
                  <li>account restrictions</li>
                  <li>removal from the platform</li>
                </ul>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Customer Responsibilities
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>Customers agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>provide accurate information</li>
                  <li>treat all rented items with care</li>
                  <li>return items on time and in reasonable condition</li>
                </ul>
                <p>Customers must not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>damage, alter, or misuse items</li>
                  <li>attempt to clean or repair items without approval</li>
                </ul>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Damage, Loss & Non-Return
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Customers are responsible for returning items within the
                  agreed rental period.
                </p>
                <p>If an item is:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>damaged beyond normal wear</li>
                  <li>not returned</li>
                  <li>lost or stolen</li>
                </ul>
                <p>The customer may be charged:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>repair costs, or</li>
                  <li>full or partial replacement value of the item</li>
                </ul>
                <p>Muse Gala reserves the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>charge the customer’s payment method on file</li>
                  <li>take further action where necessary</li>
                </ul>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Payments
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  All payments are processed through the Muse Gala platform
                </p>
                <p>Fees may include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>rental price</li>
                  <li>platform/service fees</li>
                  <li>shipping costs</li>
                </ul>
                <p>Payment processing fees may apply and are non-refundable.</p>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Disputes
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>All disputes must be handled through Muse Gala.</li>
                <li>
                  Direct resolution between customer and lender is not permitted
                </li>
                <li>Muse Gala will review all cases and determine outcomes</li>
                <li>All decisions are final</li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Platform Control
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Muse Gala reserves the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>manage and review all bookings</li>
                <li>suspend or remove User Accounts</li>
                <li>enforce platform policies</li>
                <li>update pricing, fees, and functionality</li>
              </ul>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>Muse Gala is not liable for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>delays caused by third-party services (e.g. couriers)</li>
                  <li>indirect or consequential losses</li>
                  <li>circumstances outside of reasonable control</li>
                </ul>
                <p>
                  However, Muse Gala will make reasonable efforts to resolve
                  issues fairly.
                </p>
              </div>
            </section>

            <section className="space-y-[15px]">
              <h2 className="text-2xl font-normal uppercase tracking-wider">
                Updates to Terms
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Muse Gala may update these Terms & Conditions at any time.
                Continued use of the platform constitutes acceptance of any
                changes.
              </p>
            </section>

            <section className="pt-10 border-t border-muted text-center italic text-sm text-muted-foreground">
              <p>
                By using Muse Gala, you agree to these Terms & Conditions and
                all associated policies.
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerTermsConditionsDialog;

