import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
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
    <html lang="en" className={urbanist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--toast-border)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
