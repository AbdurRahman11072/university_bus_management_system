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
    icon: [
      {
        url: "/gublogo.jpg",
        type: "image/jpeg",
      },
      // For modern browsers
      {
        url: "/gublogo.jpg",
        type: "image/jpeg",
        sizes: "32x32",
      },
      {
        url: "/gublogo.jpg",
        type: "image/jpeg",
        sizes: "16x16",
      },
      // For iOS devices
      {
        url: "/gublogo.jpg",
        type: "image/jpeg",
        sizes: "180x180",
        rel: "apple-touch-icon",
      },
    ],
    // Fallbacks for older browsers
    shortcut: "/gublogo.jpg",
    apple: "/gublogo.jpg",
  },
  // Optional: For better PWA/device integration
  appleWebApp: {
    capable: true,
    title: "GUB Bus System",
    statusBarStyle: "black-translucent",
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
