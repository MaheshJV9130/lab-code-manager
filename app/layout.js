import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LeftMenu from "@/components/LeftMenu";
import { ToastContainer } from "react-toastify";

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
  variable: '--font-jetbrains-mono', 
});
 
export const metadata = {
  metadataBase: new URL("https://labcodex.vercel.app"),
  applicationName: "LabCodex",
  title: {
    default: "LabCodex | Laboratory Experiment Tracker",
    template: "%s | LabCodex",
  },
  description:
    "LabCodex helps students and lab teams record experiment details, manage source code, and capture outputs in a clean digital workspace.",
  keywords: [
    "lab experiments",
    "code backup",
    "no login",
    "college lab",
    "experiment tracker",
    "programming assignments",
    "LabCodex",
  ],
  authors: [{ name: "LabCodex" }],
  creator: "LabCodex",
  publisher: "LabCodex",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LabCodex | Laboratory Experiment Tracker",
    description:
      "Track lab experiments, save code, and keep outputs organized in one secure workspace.",
    siteName: "LabCodex",
    type: "website",
    url: "https://labcodex.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "LabCodex",
    description:
      "Track lab experiments, save code, and keep outputs organized in one secure workspace.",
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "16x16", type: "image/png" }],
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} font-sans h-full antialiased`}
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
