import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftMenu from "@/components/LeftMenu";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Code Manager",
  description: "Laboratory experiment tracking and code management dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-100 text-slate-800 md:flex md:flex-row">
        <LeftMenu />
        <ToastContainer
          theme="dark"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
        <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
