import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-white text-[#09090B] antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
