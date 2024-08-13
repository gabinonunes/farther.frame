import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = await fetchMetadata(
    new URL(
      "/frames",
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    )
  );

  return {
    title: "Farther Allowance Tracker",
    description: "Farther Allowance Tracker",
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `https://farther.social/_next/image?url=%2Fimages%2Flanding-page-placeholder.png&w=3840&q=75`,
      "og:image": `https://farther.social/_next/image?url=%2Fimages%2Flanding-page-placeholder.png&w=3840&q=75`,
    },
    ...frameMetadata,
  };
}
 
export default function Page() {
  return <span>Farther Allowance Tracker</span>;
}