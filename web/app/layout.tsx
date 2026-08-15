import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smog-ai.com"),
  title: "smog — free open-source live copilot",
  description:
    "A free, open-source overlay for your calls. Live transcription, instant answers, and notes — bring your own OpenAI key and run it locally.",
  keywords: [
    "AI copilot",
    "live transcription",
    "meeting notes",
    "interview assistant",
    "overlay assistant",
    "smog",
  ],
  authors: [{ name: "smog" }],
  openGraph: {
    title: "smog — free open-source live copilot",
    description:
      "A free, open-source overlay for your calls. Live transcription, instant answers, notes. Bring your own OpenAI key.",
    type: "website",
    url: "https://smog-ai.com",
    siteName: "smog",
  },
  twitter: {
    card: "summary_large_image",
    title: "smog — free open-source live copilot",
    description:
      "A free, open-source overlay for your calls. Live transcription, instant answers, notes. Bring your own OpenAI key.",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
