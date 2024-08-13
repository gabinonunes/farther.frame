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

const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div style={{
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <img
            src={`https://uc9ba1bc4c0d397bff6ccf001827.previews.dropboxusercontent.com/p/thumb/ACXPe9atf7nFFy10QDqC-bDFiSkQCnyV3HGjEFypzh2vMERx1nCVO703l3HwV0De5bskVbtjvHcClZQrejV9AFrCfTg2ZvQ8nHJC5rKpnnTf3EJq-HNbSb3oPlLvaSxofe8q6BCQJXi7JWi77mvF20s7ZgsZNPwmHUQoyoLlAFHvvU5hi5FAVOAYlqVYAqYarqSuLUery-FXRdneYhpsk-2ehXJ44LoywHgpDAw8ZVcKd-6fg7C6txnGGw_OdRPqfSS0AAs1yptMMB13FLiBEH3SC2v-8zlK6CvEiyVmnyO4Qxnw_uj94QJ_Bryc8f2LZiOy7B5m2EWHP13bM--XiAmc/p.png`}
            alt="Farther"
            width="200"
            height="200"
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'white', fontSize: '80px', fontWeight: 'bold' }}>Check Your Farther Allowance</h1>
        </div>
      </div>
    ),
    
    buttons: [
      <Button action="post" target='/frames/route1'>
        My Stats
      </Button>,
      
    ],
  };
});


 
export const GET = handleRequest;
export const POST = handleRequest;