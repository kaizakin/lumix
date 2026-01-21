import localFont from "next/font/local";

export const asimovian = localFont({
  src: [
    {
      path: "../public/Asimovian-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

export const MapleMono = localFont({
  src: [
    {
      path: "../public/MapleMono-LightItalic.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-maple"
})

export const euclid = localFont({
  src: [
    {
      path: "../public/Euclid-Circular-B-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/Euclid-Circular-B-Bold.ttf",
      weight: "700",
      style: "normal"
    },
  ],
  variable: "--font-euclid"
})
