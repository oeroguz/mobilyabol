export const dynamic = "force-dynamic";

import "./globals.css";

export const metadata = {
  title: "Mobilyabol | Mobilya Aramanın En Kolay Yolu",
  description: "Türkiye'nin mobilya pazaryeri.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta name="theme-color" content="#E8A07A" />
      </head>
      <body>{children}</body>
    </html>
  );
}
