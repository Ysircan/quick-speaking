// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ 忽略构建时的 ESLint 报错（例如 no-explicit-any、unused-vars）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ 忽略构建时的类型错误（例如 any、类型不匹配等）
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
