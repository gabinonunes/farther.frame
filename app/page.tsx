import React from 'react';
import { fetchMetadata } from "frames.js/next";
import Image from 'next/image';
import { Metadata } from 'next';

const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = await fetchMetadata(new URL("/frames", baseUrl));

  return {
    title: "Farther Allowance Tracker by GG Frames",
    description: "Track your Farther allowance with this Frame",
    openGraph: {
      title: "Farther Allowance Tracker",
      description: "Track your Farther allowance with this Frame",
      images: [`${baseUrl}/farther.png`],
    },
    other: {
      ...Object.fromEntries(Object.entries(frameMetadata).filter(([_, v]) => v != null)),
      "fc:frame": "vNext",
      "fc:frame:image": `${baseUrl}/farther.png`,
      "og:image": `${baseUrl}/farther.png`,
    },
  };
}

export default function Page() {
  return (
    <div>
      <h1>Farther Allowance Tracker</h1>
      <p>This is a Farcaster Frame for tracking Farther allowance.</p>
      <Image
        width={1200}
        height={630}
        src="/farther.png"
        alt="Farther Allowance Tracker"
      />
    </div>
  );
}