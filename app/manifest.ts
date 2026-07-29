import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "1118",
    short_name: "1118",
    description: "Original digital products built and operated by 1118.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#fbf8f2",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
