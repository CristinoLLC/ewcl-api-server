// next.config.js
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'tailwindcss/version': path.resolve(
        __dirname,
        'node_modules',
        'tailwindcss/lib/util/version.js'
      ),
      'tailwindcss/version.js': path.resolve(
        __dirname,
        'node_modules',
        'tailwindcss/lib/util/version.js'
      )
    };
    
    // Add rule for molecular structure files
    config.module.rules.push({
      test: /\.(gltf|glb|bin|pdb|cif)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/files',
          outputPath: 'static/files',
          name: '[name].[hash].[ext]',
        },
      },
    });
    
    return config;
  },
  // For proper Sass/SCSS support in Molstar
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')]
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002']
    }
  },
};

module.exports = nextConfig;
