/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images:{
    domains: ['lh3.googleusercontent.com','api.multiavatar.com','upload.wikimedia.org']
  },
  reactStrictMode:false,
}

module.exports = nextConfig
