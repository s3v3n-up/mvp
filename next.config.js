/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [
            "i.pravatar.cc",
            "res.cloudinary.com",
        ],
    }
};

module.exports = nextConfig;
