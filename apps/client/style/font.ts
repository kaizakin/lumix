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
  src:[
    {
      path: "../public/MapleMono-LightItalic.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-maple"
})
