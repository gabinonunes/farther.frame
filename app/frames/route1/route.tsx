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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#3f48cc', padding: '10px' }}>
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

  const VALUE_COLOR = '#ffd05d';

  return {
    image: (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#121872', padding: '10px' }}>
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
              border: `2px solid ${VALUE_COLOR}`,
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '36px', marginBottom: '10px', margin: '0' }}>
              {displayName || 'Unknown User'} 
            </h2>
            <p style={{ margin: '10px 0' }}>
              Rank {' '}<span style={{ color: VALUE_COLOR }}>{rank}</span> ⭐ Tipper Score {' '}<span style={{ color: VALUE_COLOR }}>{tipperScore !== undefined ? Number(tipperScore).toFixed(2) : 'N/A'}</span>
            </p>
            <p style={{ margin: '10px 0' }}>
              Eligible Tippers {' '}<span style={{ color: VALUE_COLOR }}>{eligibleTippers}</span> ⭐ Tip Minimum {' '}<span style={{ color: VALUE_COLOR }}>{tipMinimum}</span>✨
            </p>
          </div>
          <img 
            src="https://uc9ba1bc4c0d397bff6ccf001827.previews.dropboxusercontent.com/p/thumb/ACXx-fe0M9OrOEbf-YPADF-RYGBFCZM61nK-lPUzBDGWIyRMSFSKXAllX2AeL9JYRUHhSoDGiZe6KeiaIiKYtr2ymt70nJ-9B8wyt1v-rdsr-yxNzfh_rcq33lL0oIk1eDDRvUSK3XL4J4yCFIzjHMc9Glm40WfGRIcD55doRXqXd7MZ4JYatZe7DYwrSr2btYmSIlJxekVy7q1cv6KqY76w7cy7oUtZctROg_d3LcXeXyw9SQ0_S5FaXkXL7SzIXAQz2VlDNJdG_G6k16i8f1TusbJnrkN-AXiKaKogZSa5DQAUmX_q9DGXKAsK2ozwpZ3gXnGs8Jf4RRgLCsRfznbb/p.png" 
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
            border: `2px solid ${VALUE_COLOR}`,
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '40px', margin: '0 0 20px 0' }}>Current Cycle</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '33%',
              borderRight: `2px solid ${VALUE_COLOR}`
            }}>
              <h3 style={{ fontSize: '34px', margin: '0 0 5px 0' }}>Allowance</h3>
              <p style={{ fontSize: '50px', margin: '0', color: VALUE_COLOR }}>{allowance}</p>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '33%',
              borderRight: `2px solid ${VALUE_COLOR}`
            }}>
              <h3 style={{ fontSize: '34px', margin: '0 0 5px 0' }}>Remaining</h3>
              <p style={{ fontSize: '50px', margin: '0', color: VALUE_COLOR }}>{remaining}</p>
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '33%'
            }}>
              <h3 style={{ fontSize: '34px', margin: '0 0 5px 0' }}>Received</h3>
              <p style={{ fontSize: '50px', margin: '0', color: VALUE_COLOR }}>{received}</p>
            </div>
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