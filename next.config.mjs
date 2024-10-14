/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'media.rawg.io',
            },
            {
                hostname: 'images.genius.com',
            },
            {
                hostname: 'image.tmdb.org',
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedForwardedHosts: [
                'glorious-lamp-6rvw4r59r563rjw9-3000.app.github.dev',
                '*.app.github.dev',
                'localhost:3000',
            ],
            allowedOrigins: [
                'glorious-lamp-6rvw4r59r563rjw9-3000.app.github.dev',
                '*.app.github.dev',
                'localhost:3000',
            ],
        },
    },
};

export default nextConfig;
