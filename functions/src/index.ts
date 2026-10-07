import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as crypto from "crypto";

admin.initializeApp();

const APP_ID = "vpaas-magic-cookie-5d6513283a094fa5a31dbc4c08404bce";
const KID = `${APP_ID}/585132`;

function base64url(data: Buffer | Uint8Array): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateJitsiJWT(
  privateKeyPem: string,
  room: string,
  displayName: string,
  email: string,
  isModerator: boolean
): string {
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

  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const normalizedPem = privateKeyPem.replace(/\\n/g, "\n");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signingInput);
  sign.end();
  const signature = sign.sign(normalizedPem);

  return `${signingInput}.${base64url(signature)}`;
}

export const jitsiToken = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Client-Info, Apikey"
  );

  if (req.method === "OPTIONS") {
    res.status(200).send("");
    return;
  }

  try {
    const privateKeyPem = functions.config().jitsi?.private_key;
    if (!privateKeyPem) {
      res.status(500).json({ error: "jitsi.private_key not configured" });
      return;
    }

    const { room, displayName, email, isModerator } = req.body as {
      room: string;
      displayName: string;
      email?: string;
      isModerator?: boolean;
    };

    if (!room || !displayName) {
      res.status(400).json({ error: "room and displayName are required" });
      return;
    }

    const token = generateJitsiJWT(
      privateKeyPem,
      room,
      displayName,
      email ?? "",
      isModerator ?? false
    );

    res.status(200).json({ token, appId: APP_ID });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
