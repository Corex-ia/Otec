/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: [
              'camera=(self "https://8x8.vc")',
              'microphone=(self "https://8x8.vc")',
              'display-capture=(self "https://8x8.vc")',
              'fullscreen=(self "https://8x8.vc")',
            ].join(', '),
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://8x8.vc",
              "frame-src 'self' https://8x8.vc",
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.supabase.co wss://*.supabase.co https://8x8.vc wss://8x8.vc",
              "media-src 'self' blob: https:",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline' https://8x8.vc https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
