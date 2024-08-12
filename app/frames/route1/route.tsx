import { createFrames, Button } from "frames.js/next";
import { frames as framesConfig } from "../frames";
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
  const { message } = ctx;
  const fid = message?.requesterFid;
  const verified = message?.isValid;
  
  console.log('Context:', ctx);
  console.log('FID:', fid);
  console.log('verified', verified);
  console.log('message', message);

  // If fid is undefined, we need to handle this case
  if (!fid) {
    console.log('No FID available');
    return {
      image: (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#232739', padding: '10px' }}>
          <h2>No user data available</h2>
          <p>Please try again or check your connection.</p>
        </div>
      ),
      buttons: [
        <Button key="retry" action="post" target="/frames/route1">Retry</Button>,
      ],
    };
  }

  // Define the type for the API response
  type FartherAPIResponse = {
    result?: {
      data?: {
        displayName?: string;
        tipperScore?: number;
        rank?: string | number;
        tips?: Record<string, any>;
        givenCount?: number;
        receivedCount?: number;
        givenAmount?: number;
        receivedAmount?: number;
        allowance?: number;
        userBalance?: number;
        allocations?: Array<{ username: string; percentage: number }>;
        pfpUrl?: string;
      };
    };
  };

  // Fetch data from farther.social API
  let fartherData: FartherAPIResponse = {};
  try {
    const params = { fid };
    const baseUrl = 'https://farther.social';
    const url = `${baseUrl}/api/v1/public.user.byFid?input=${encodeURIComponent(JSON.stringify(params))}`;
    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    try {
      fartherData = JSON.parse(text);
    } catch (jsonError) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid JSON response');
    }

    console.log('Farther API Data:', fartherData);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching or parsing data:', error.message);
    } else {
      console.error('Error fetching or parsing data: Unknown error');
    }
  }

  // Extract relevant data from fartherData
  const userData = fartherData?.result?.data || {};
  console.log('Processed user data:', userData);
  const { displayName, tipperScore, pfpUrl } = userData;
  const defaultPfpUrl = 'https://farther.social/images/farther-logo.png'; 
  const tips = userData.tips || {};
  const currentCycle = tips.currentCycle || {};

  // Extract specific data points
  const rank = tips.rank || 'N/A';
  const eligibleTippers = currentCycle.eligibleTippers || 'N/A';
  const tipMinimum = currentCycle.tipMinimum || 'N/A';
  const allowance = currentCycle.allowance || 'N/A';
  const used = currentCycle.givenAmount || 'N/A';
  const remaining = currentCycle.remainingAllowance || 'N/A';
  const given = currentCycle.givenAmount || 'N/A';
  const received = currentCycle.receivedAmount || 'N/A';

  return {
    image: (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#232739', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <img 
            src={pfpUrl || defaultPfpUrl} 
            alt="Profile Picture" 
            width={100} 
            height={100} 
            style={{ 
              borderRadius: '30%', 
              marginLeft: '20px',
              marginTop: '20px',
            }} 
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              color: 'white',
              fontSize: '30px',
            }}
          >
            <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>
              {displayName || 'Unknown User'} | <p style={{ margin: '0px 0' }}>FID: {fid || 'N/A'}</p>
            </h2>
            <p style={{ margin: '0px 0' }}>Rank: {rank} ⭐ Tipper Score: {tipperScore !== undefined ? Number(tipperScore).toFixed(2) : 'N/A'}</p>
            <p style={{ margin: '0px 0' }}>Eligible Tippers: {eligibleTippers} ⭐ Tip Minimum: {tipMinimum}✨</p>
          </div>
          <img 
            src="https://farther.social/images/farther-logo.png" 
            alt="Farther Logo" 
            width={100} 
            height={100} 
            style={{ borderRadius: '50%', marginRight: '20px', marginTop: '20px', }} 
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            color: 'white',
            fontSize: '30px',
            marginTop: '20px',
          }}
        >
          <h3 style={{ fontSize: '36px', }}>Allowance: {allowance}</h3>
          <div style={{ marginLeft: '70px', marginRight: '70px', display: 'flex', justifyContent: 'space-between', width: '80%' }}>
            <p>Used: {used}</p>
            <p>Remaining: {remaining}</p>
          </div>
          
          <div style={{ marginLeft: '70px', marginRight: '70px', display: 'flex', justifyContent: 'space-between', width: '80%' }}>
            <p>Given: {given}</p>
            <p>Received: {received}</p>
          </div>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            color: 'white',
            fontSize: '25px',
          }}
        >
          Farther Stats | by @greatgambino | {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
    ),
    buttons: [
      <Button key="stats" action="post" target="/frames/route1">My Stats</Button>,
      <Button key="share" action="post" target="/frames/route2">Share</Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;