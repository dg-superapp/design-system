import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Allow App Router to treat `.mdx` files as routable pages.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// @next/mdx wrapper — enables MDX support with the default MDX compiler.
// `extension: /\.mdx?$/` matches both .md and .mdx.
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
