import React from 'react';
import { fetchMetadata } from "frames.js/next";
import Head from 'next/head';

export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
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
    <>
      <Head>
        <title>My Page</title>
        <meta name="description" content="This is a Farcaster Frame for tracking Farther allowance." />
        <meta property="og:title" content="Farther Allowance Tracker" />
        <meta property="og:image" content="/static/images/farther.png" />
      </Head>
      <div>
        <h1>Farther Allowance Tracker</h1>
        <p>This is a Farcaster Frame for tracking Farther allowance.</p>
      </div>
    </>
  );
}