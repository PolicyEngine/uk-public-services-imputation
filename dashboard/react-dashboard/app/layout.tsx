import { PolicyEngineShell } from "@policyengine/ui-kit/layout";
import "@policyengine/ui-kit/styles.css";

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE = "UK Public Services Spending | PolicyEngine";
const DESCRIPTION =
  "Interactive dashboard analysing UK public services spending across demographic groups and regions for the 2022-23 fiscal year. Built on PolicyEngine's enhanced Family Resources Survey.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2c6496",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PolicyEngineShell country="uk">
        <div className="app">{children}</div>
              </PolicyEngineShell>
        {/* Google Analytics: policyengine.org's GA4 property; this app is served at
            policyengine.org/uk/public-services-spending through a rewrite, where the main site's GA
            does not reach. Page views only. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-2YHG89FY0N"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-2YHG89FY0N');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
