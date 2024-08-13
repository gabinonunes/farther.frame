/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { frames as framesConfig } from "./frames";
import { fetchMetadata } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import Image from 'next/image';

const frames = createFrames({
    middleware: [
      farcasterHubContext({
        ...(process.env.NODE_ENV === "production"
          ? {
              hubHttpUrl: "https://hubs.airstack.xyz",
              hubRequestOptions: {
                headers: {
                  "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
                },
              },
            }
          : {
              hubHttpUrl: "http://localhost:3010/hub",
            }),
      }),
    ],
  });

const handleRequest = frames(async (ctx) => {
  const metadata = await fetchMetadata(`${process.env.NEXT_PUBLIC_HOST}/frames`);
  
  return {
    image: (
      <div style={{
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <img
          src='https://farther.social/_next/image?url=%2Fimages%2Flanding-page-placeholder.png&w=3840&q=75'
          alt="Farther"
          width="300"
          height="300"
        />
      </div>
    ),
    
        buttons: [
      <Button action="post" target='/frames/route1'>
        My Stats
      </Button>,
      <Button action="post" target='/route2'>
        Share
      </Button>,
    ],
    metadata,
  };
});


 
export const GET = handleRequest;
export const POST = handleRequest;