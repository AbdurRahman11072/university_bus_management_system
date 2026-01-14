import "@/app/globals.css";
import DashboardHader from "@/components/dashboard/dashboardHeader";
import DashboardSideBar from "@/components/dashboard/dashboardSideBar";
import ProtectedRoute from "@/hooks/protectedRote";
import { AuthProvider } from "@/lib/AuthContext";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
          <ProtectedRoute>
            <DashboardHader />
            <main className="mx-auto flex ">
              <DashboardSideBar />
              <div className="p-6 h-[90vh] overflow-y-scroll flex-1">
                {children}
              </div>
            </main>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
