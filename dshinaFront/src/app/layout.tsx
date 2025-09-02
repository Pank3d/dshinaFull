import type { Metadata } from "next";
import { ReactQueryProvider } from "../../fsd/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSHINA.RU - Интернет-магазин шин и дисков",
  description:
    "Широкий выбор автомобильных шин и дисков по выгодным ценам. Быстрая доставка по России. Качественная резина для вашего автомобиля.",
  keywords: [
    "шины",
    "диски",
    "автомобильные шины",
    "летние шины",
    "зимние шины",
    "автошины",
    "колеса",
    "резина",
  ],
  authors: [{ name: "DSHINA.RU" }],
  creator: "DSHINA.RU",
  publisher: "DSHINA.RU",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "DSHINA.RU - Интернет-магазин шин и дисков",
    description:
      "Широкий выбор автомобильных шин и дисков по выгодным ценам. Быстрая доставка по России.",
    url: "https://dmshina.ru",
    siteName: "DSHINA.RU",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DSHINA.RU - Интернет-магазин шин и дисков",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSHINA.RU - Интернет-магазин шин и дисков",
    description: "Широкий выбор автомобильных шин и дисков по выгодным ценам",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
