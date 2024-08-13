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
  const received = currentCycle.receivedAmount || 'N/A';

  return {
    image: (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'black', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '50px' }}>
          <img 
            src={pfpUrl || defaultPfpUrl} 
            alt="Profile Picture" 
            width={150} 
            height={150} 
            style={{ 
              borderRadius: '30%', 
              marginLeft: '50px',
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
              padding: '20px',
              margin: '0 30px',
              border: '2px solid #ffd05d',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '36px', marginBottom: '10px', margin: '0' }}>
              {displayName || 'Unknown User'} | FID: {fid || 'N/A'}
            </h2>
            <p style={{ margin: '10px 0' }}>Rank: {rank} ⭐ Tipper Score: {tipperScore !== undefined ? Number(tipperScore).toFixed(2) : 'N/A'}</p>
            <p style={{ margin: '10px 0' }}>Eligible Tippers: {eligibleTippers} ⭐ Tip Minimum: {tipMinimum}✨</p>
          </div>
          <img 
            src="https://uc6b2af5c5cd7ae0b3b51f8892aa.previews.dropboxusercontent.com/p/thumb/ACVJRCJ1nWURNC6t9APx74Iv2u8XuhOThmptU6aQ-4czZn7ibigjopB2Y3aIZYt8Y1l5ZIwD5lxL5eZEtXioqTpbQLcKMe5wh9KDY7UcJZhNfv1G3PTnmvQgAKA5Hao9DOE5HT_hcQpEIAsBZXr4UpdPYO8Cp8s5skKyc9oDJALxFCR-7KlnHU-LfQ-ulNqf77v6v-1KaxToNjgupekNxPYGLm-Fs-WhOn_84m862p_-gpX3LK80P41tS8FNHAE2WfHxZQQLLSZ83EvaYoYXmBoHPXPTG2Hc2f6ojCnQOE673JIehajvSslJUMa3vA5Bqa98JpBvGSC8wNyOU7dB1gW9/p.png" 
            alt="Farther Logo" 
            width={150} 
            height={150} 
            style={{ borderRadius: '50%', marginRight: '50px' }} 
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '30px',
            padding: '20px',
            margin: '30px 50px',
            border: '2px solid #ffd05d',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>Allowance: {allowance}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <p style={{ margin: '10px 0' }}>Used: {used}</p>
            <p style={{ margin: '10px 0' }}>Remaining: {remaining}</p>
            <p style={{ margin: '10px 0' }}>Received: {received}</p>
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
      <Button 
        key="share" 
        action="post_redirect" 
        target="https://warpcast.com/~/compose?text=Check%20out%20my%20Farther%20stats!%20%0A%0Ahttps%3A%2F%2Fyour-frame-url.com"
      >
        Share
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;