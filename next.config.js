/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'localhost',
            'https://*.googleusercontent.com',
            'drive.google.com',
           'avatars.githubusercontent.com'
    ]}
}

module.exports = nextConfig
