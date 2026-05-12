import type { NextConfig } from "next";

// Mounted under /uk/public-services-spending on policyengine.org via
// policyengine-app-v2's appZoneRoutes. NEXT_PUBLIC_BASE_PATH=""  to build at
// root for local dev / standalone deploys.
const configured = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath =
  configured === "" ? undefined : configured || "/uk/public-services-spending";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath ?? "",
  },
  poweredByHeader: false,
  // plotly.js + react-plotly.js are CJS / read browser globals; transpile so
  // Next/Turbopack can ship them through the client bundle without choking.
  transpilePackages: ["plotly.js", "react-plotly.js"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
