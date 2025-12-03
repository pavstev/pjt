import { createMDX } from 'fumadocs-mdx/next';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '',
  assetPrefix: isProd ? 'https://pjt.stevanpavlovic.com/' : '',
};

const withMDX = createMDX();

export default withMDX(config);