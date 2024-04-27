/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                '*.app.github.dev',
            ],
            
        }
    }
};

export default nextConfig;
