/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
              },
        ],
        domains: [
            'localhost',
            '*.googleusercontent.com',
            'drive.google.com',
            'avatars.githubusercontent.com'
    ]}
}

module.exports = nextConfig
