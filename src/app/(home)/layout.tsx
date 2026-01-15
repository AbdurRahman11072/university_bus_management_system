import "@/app/globals.css";
import Footer2 from "@/components/homeComponent/footer2";
import Header from "@/components/homeComponent/NavigationMenu/header";
import ProtectedSurvey from "@/hooks/protecedtSurvey";
import { AuthProvider } from "@/lib/AuthContext";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green University Bus Management System",
  description: "Book your bus to reach your destination",
  icons: {
    // Main favicon for browsers
    icon: "/favicon.ico",

    // Apple devices (iOS)
    apple: [
      "/apple-touch-icon.png",
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    // Android/Chrome
    shortcut: "/favicon-16x16.png",
  },

  // CRITICAL for mobile shortcuts
  manifest: "/manifest.json",

  // iOS specific
  appleWebApp: {
    capable: true,
    title: "GUB Bus System",
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/apple-touch-icon.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // Android/Windows specific
  applicationName: "GUB Bus System",
  themeColor: "#4CAF50", // Use your brand color
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  // Additional meta tags for better mobile support
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "GUB Bus System",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  mb-10 lg:mb-0`}
      >
        <AuthProvider>
          <ProtectedSurvey>
            <Header />
            <main className="mx-auto ">{children}</main>
            <Toaster />
            <Footer2 />
          </ProtectedSurvey>
        </AuthProvider>
      </body>
    </html>
  );
}
