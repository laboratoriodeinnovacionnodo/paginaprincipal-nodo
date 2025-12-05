import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NODO - Centro de Innovación Tecnológica",
    short_name: "NODO",
    description: "Centro de innovación tecnológica y educación digital en Argentina",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0EA5E9",
    icons: [
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
