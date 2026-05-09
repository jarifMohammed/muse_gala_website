import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";
import AuthSessionProvider from "@/providers/AuthSessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

export const avenir = localFont({
  src: "./fonts/avenir/Avenir Regular.ttf",
  variable: "--font-avenir",
  weight: "100 900",
  display: "swap",
});

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muse Gala | Discover Dress Hire Near You",
  description:
    "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
  keywords: [
    "designer dress hire Australia",
    "dress hire near me",
    "Bec and Bridge dress hire",
    "Oh Polly dress hire",
    "Arcina Ori dress hire",
    "LIDÉE dress hire",
    "formal dress hire",
    "party dress hire",
    "event dress hire",
    "last minute dress hire",
  ],
  authors: [{ name: "Muse Gala" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Muse Gala | Discover Dress Hire Near You",
    description:
      "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
    url: "https://musegala.com.au",
    siteName: "Muse Gala",
    images: [
        {
          url: "https://musegala.com.au/logos/logo.png",
        width: 1200,
        height: 630,
        alt: "Muse Gala Designer Dress Hire",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muse Gala | Discover Dress Hire Near You",
    description:
      "Discover dress hire near you with Muse Gala. Browse dresses available nearby, check real-time availability, and book for your next event with local pick up and delivery.",
      images: ["https://musegala.com.au/logos/logo.png"], 
    creator: "@MuseGala",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", avenir.className)}>
        <AuthSessionProvider>
          <AppProvider>
            {children}
            {/* <Footer /> */}
            <Toaster />
          </AppProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
