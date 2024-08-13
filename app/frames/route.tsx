/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { frames as framesConfig } from "./frames";
import { fetchMetadata } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";

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
          src='/farther.png'
          alt="Farther"
          width="300"
          height="300"
        />
      </div>
    ),
    
        buttons: [
      <Button action="post" target='frames/route1'>
        My Stats
      </Button>,
      <Button action="post" target='/route2'>
        Share
      </Button>,
    ],
  };
});


 
export const GET = handleRequest;
export const POST = handleRequest;