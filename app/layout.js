import "./globals.css";

export const metadata = {
  title: "Mobilyabol | Mobilya Aramanın En Kolay Yolu",
  description:
    "Türkiye'nin mobilya pazaryeri. Binlerce ürün, yüzlerce mağaza arasından kolayca karşılaştır, WhatsApp ile doğrudan iletişime geç. Koltuk takımı, yatak odası, yemek odası ve daha fazlası.",
  keywords: [
    "mobilya",
    "mobilya pazaryeri",
    "koltuk takımı",
    "yatak odası",
    "yemek odası",
    "mobilya fiyatları",
    "mobilya mağazası",
    "online mobilya",
    "İstanbul mobilya",
    "Ankara mobilya",
    "Bursa mobilya",
    "İnegöl mobilya",
    "Masko",
    "Modoko",
    "Siteler",
  ],
  authors: [{ name: "Mobilyabol" }],
  creator: "Mobilyabol",
  publisher: "Mobilyabol",
  metadataBase: new URL("https://mobilyabol.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mobilyabol | Mobilya Aramanın En Kolay Yolu",
    description:
      "Türkiye'nin mobilya pazaryeri. Kolayca karşılaştır, WhatsApp ile doğrudan iletişime geç.",
    url: "https://mobilyabol.com",
    siteName: "Mobilyabol",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mobilyabol - Mobilya Aramanın En Kolay Yolu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobilyabol | Mobilya Aramanın En Kolay Yolu",
    description:
      "Türkiye'nin mobilya pazaryeri. Kolayca karşılaştır, WhatsApp ile doğrudan iletişime geç.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console doğrulama kodu buraya gelecek
    // google: "VERIFICATION_CODE",
  },
};

function JsonLd() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mobilyabol",
    url: "https://mobilyabol.com",
    description:
      "Türkiye'nin mobilya pazaryeri. Binlerce ürün, yüzlerce mağaza.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mobilyabol.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mobilyabol",
    url: "https://mobilyabol.com",
    logo: "https://mobilyabol.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#E8A07A" />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
