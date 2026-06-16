import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recepta — Never lose a job to a missed call again",
  description: "Recepta automatically texts back anyone who calls when you can't pick up. Captures their job details and adds them to your lead dashboard. Built for tradespeople.",
  openGraph: {
    title: "Recepta — Never lose a job to a missed call again",
    description: "Automatically texts back missed calls and captures leads. Built for tradespeople.",
    url: "https://getrecepta.co",
    siteName: "Recepta",
    images: [
      {
        url: "https://getrecepta.co/hero.webp",
        width: 1200,
        height: 630,
        alt: "Recepta — Missed call lead recovery for tradespeople",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recepta — Never lose a job to a missed call again",
    description: "Automatically texts back missed calls and captures leads. Built for tradespeople.",
    images: ["https://getrecepta.co/hero.webp"],
  },
};