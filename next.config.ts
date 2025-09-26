import type { NextConfig } from "next";
import { GITHUB_PROFILE_IMAGE_URL } from "./app/lib/constants";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(GITHUB_PROFILE_IMAGE_URL),
    ],
  },
};

export default nextConfig;
