/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'molstar': require.resolve('molstar')
    }
    return config
  },
  transpilePackages: ['molstar']
}

module.exports = nextConfig 