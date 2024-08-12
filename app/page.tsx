import { fetchMetadata } from "frames.js/next";
 
export async function generateMetadata() {
  return {
    title: "Farther Allowance Tracker by GG Frames",
    // fetchMetadata automatically constructs the full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}
 
export default function Page() {
  return (
    <div>
      {/* This is the frame image */}
      <img
        width="1200"
        height="630"
        src={`${
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        }/farther.png`}
        alt="Farther Allowance Tracker"
      />
    </div>
  );
}