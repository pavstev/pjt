import { createMDX } from 'fumadocs-mdx/next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'pjt';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `https://${repoName}.stevanpavlovic.com/` : '',
};

const withMDX = createMDX();

export default withMDX(config);