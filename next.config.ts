import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents (dynamicIO) left OFF on purpose: this app is cookie/auth-driven and
  // dynamic per user, which is the conventional App Router model @supabase/ssr expects.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
