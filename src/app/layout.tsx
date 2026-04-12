import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090B",
};

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zcash Israel — הצפן את הכסף שלך",
  description: "פורטל חינוכי לפרוטוקול Zcash — פרטיות מוכחת מתמטית לקהילה הישראלית",
  keywords: ["Zcash", "ZEC", "פרטיות", "קריפטו", "zk-SNARKs", "ישראל"],
  icons: {
    icon: [{ url: "/icon.jpg", type: "image/jpeg" }],
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-white text-[#09090B] antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
