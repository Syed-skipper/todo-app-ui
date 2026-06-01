import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppChakraProvider from "../components/ChakraProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Family Expense Tracker",
  description: "Shared credit card expense tracking for your family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppChakraProvider>{children}</AppChakraProvider>
      </body>
    </html>
  );
}
