import type { MetadataRoute } from "next";

// Web App Manifest — prepares the site for a future PWA. Icons point to the
// generated icon routes (app/icon.tsx and app/apple-icon.tsx).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nutrição & Movimento",
    short_name: "Nutrição",
    description:
      "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.",
    start_url: "/pt",
    scope: "/",
    display: "standalone",
    background_color: "#FAF8F4",
    theme_color: "#556B2F",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
