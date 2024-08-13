import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
  
  const framesUrl = new URL("/frames", baseUrl);
  
  try {
    const metadata = await fetchMetadata(framesUrl);
    return {
      title: "Farther Allowance Tracker",
      other: metadata,
    };
  } catch (error) {
    console.error(`Failed to fetch frame metadata from ${framesUrl}:`, error);
    return {
      title: "Farther Allowance Tracker",
      other: {}, // Return empty object or default metadata
    };
  }
}

export default function Page() {
  return <span>Farther Allowance Tracker</span>;
}