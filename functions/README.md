# Firebase Cloud Functions

## Setup

```bash
cd functions
npm install
```

## Configure Jitsi private key

```bash
firebase functions:config:set jitsi.private_key="$(cat your-key.pem)"
```

For local emulation, create `.runtimeconfig.json`:

```json
{
  "jitsi": {
    "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }
}
```

## Deploy

```bash
npm run deploy
```

## Available Functions

| Function | Trigger | Description |
|---|---|---|
| `jitsiToken` | HTTPS | Generates a signed JWT for 8x8 JaaS video rooms |

## Note on Supabase Edge Functions

The primary deployment uses Supabase Edge Functions (`/supabase/functions`).
This `/functions` directory provides the equivalent Firebase Cloud Functions
implementation as an alternative backend option.

The `JITSI_PRIVATE_KEY` secret must be set in whichever platform is used.
