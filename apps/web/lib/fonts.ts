import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";

// Display serif — page titles, section heroes
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  axes: ["opsz", "SOFT"],
});

// Body / UI
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Tabular numerals, timestamps, IDs, code
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
