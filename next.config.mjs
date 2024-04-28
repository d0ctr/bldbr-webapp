/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'media.rawg.io'
            }
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: [
                '*.app.github.dev',
            ],
            
        }
    }
};

export default nextConfig;
