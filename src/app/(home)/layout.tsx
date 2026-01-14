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
  description: "Book you bus to reach your destination",
  icons: {
    icon: "/gublogo.jpg",
    shortcut: "/gublogo.jpg",
    apple: "/gublogo.jpg",
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
