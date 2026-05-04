import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { APP_METADATA } from "@/app/constants";
import "./globals.css";
import { CategoryNav } from "@/src/widgets/category-nav";
import { TopProgressBar } from "@/src/shared/ui/top-progress-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = APP_METADATA;

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <TopProgressBar />
        <div className="w-full flex flex-col gap-3 lg:gap-6 max-w-337.5 mx-auto p-4 lg:p-6">
          <CategoryNav />
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
