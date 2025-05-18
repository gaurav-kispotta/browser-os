import type { NextConfig } from "next";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const nextConfig: NextConfig = {
  env: {
    INTEGRATION_TEST: process.env.INTEGRATION_TEST || 'false',
  },
};

export default nextConfig;
