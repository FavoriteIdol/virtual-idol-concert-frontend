import "../public/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import {getMessages} from 'next-intl/server';

import { Providers } from "../components/providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="application-name" content="Stage On" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Stage On" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
