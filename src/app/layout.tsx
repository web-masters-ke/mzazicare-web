import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MzaziCare - Trusted Caregivers for Your Loved Ones",
  description:
    "Connect with vetted, compassionate caregivers for elderly parents. Professional in-home care made simple. Serving families across Kenya.",
  keywords: [
    "elderly care",
    "caregiver",
    "home care",
    "senior care",
    "family care",
    "Kenya",
    "Nairobi",
    "parent care",
  ],
  authors: [{ name: "MzaziCare" }],
  openGraph: {
    title: "MzaziCare - Trusted Caregivers for Your Loved Ones",
    description:
      "Connect with vetted, compassionate caregivers for elderly parents. Professional in-home care made simple.",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "MzaziCare - Trusted Caregivers for Your Loved Ones",
    description:
      "Connect with vetted, compassionate caregivers for elderly parents. Professional in-home care made simple.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body className="font-sans antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
