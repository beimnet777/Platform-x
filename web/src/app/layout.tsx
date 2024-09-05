import type { Metadata } from "next";
import { Advent_Pro, Capriola, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../store/store";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });
const capriola = Capriola({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-capriola",
});
const adventPro = Advent_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-advent-pro",
});


export const metadata: Metadata = {
  title: 'Platform X',
  description: 'Platform X: An advanced data collection and management tool for corporate entities, featuring user management, task management, data collection, and subscription management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <StoreProvider>
          {children}
        </StoreProvider>
        </body>
    </html>
  );
}

