import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const APP_ID = "vpaas-magic-cookie-5d6513283a094fa5a31dbc4c08404bce";
const KID = `${APP_ID}/585132`;

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const normalized = pem.replace(/\\n/g, "\n");
  const pemContents = normalized
    .replace(/-----BEGIN RSA PRIVATE KEY-----/, "")
    .replace(/-----END RSA PRIVATE KEY-----/, "")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function base64url(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  let str = "";
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function generateJitsiJWT(
  privateKey: CryptoKey,
  room: string,
  displayName: string,
  email: string,
  isModerator: boolean
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT", kid: KID };
  const payload = {
    aud: "jitsi",
    iss: "chat",
    iat: now,
    nbf: now - 10,
    exp: now + 3600,
    sub: APP_ID,
    context: {
      features: {
        livestreaming: false,
        "file-upload": false,
        "outbound-call": false,
        "sip-outbound-call": false,
        transcription: false,
        "list-visitors": false,
        recording: false,
        flip: false,
      },
      user: {
        "hidden-from-recorder": false,
        moderator: isModerator,
        name: displayName,
        id: email || displayName,
        avatar: "",
        email: email,
      },
    },
    room: room,
  };

  const encodedHeader = base64url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64url(signature)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const privateKeyPem = Deno.env.get("JITSI_PRIVATE_KEY");
    if (!privateKeyPem) {
      return new Response(
        JSON.stringify({ error: "JITSI_PRIVATE_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { room, displayName, email, isModerator } = await req.json();

    if (!room || !displayName) {
      return new Response(
        JSON.stringify({ error: "room and displayName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const privateKey = await importPrivateKey(privateKeyPem);
    const token = await generateJitsiJWT(
      privateKey,
      room,
      displayName,
      email ?? "",
      isModerator ?? false
    );

    return new Response(
      JSON.stringify({ token, appId: APP_ID }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
