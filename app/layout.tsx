import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://youtube-transcript-api-production-0221.up.railway.app"),
  title: {
    default: "YouTube Transcript API",
    template: "%s"
  },
  description:
    "Extract transcripts, captions, metadata, and languages from YouTube videos instantly.",
  keywords: [
    "YouTube transcript API",
    "YouTube subtitles API",
    "caption extraction",
    "video metadata API",
    "RapidAPI"
  ],
  openGraph: {
    title: "YouTube Transcript API",
    description:
      "Extract transcripts, captions, metadata, and languages from YouTube videos instantly.",
    url: "https://youtube-transcript-api-production-0221.up.railway.app",
    siteName: "YouTube Transcript API",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Transcript API",
    description:
      "Extract transcripts, captions, metadata, and languages from YouTube videos instantly."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
