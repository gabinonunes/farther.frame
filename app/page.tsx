import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';

  const framesMetadata = await fetchMetadata(new URL('/frames', baseUrl));

  return {
    title: "Farther Allowance Tracker",
    other: framesMetadata,
  };
}

export default function Page() {
  return <span>Farther Allowance Tracker</span>;
}