import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "BDI Check-in Form",
  description: "Check into a BDI space",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        { }
        {/* <script */}
        {/*   // async */}
        {/*   crossOrigin="anonymous" */}
        {/*   src="//unpkg.com/react-scan/dist/auto.global.js" */}
        {/* /> */}
      </head>
      <body>
        <main className="flex h-full justify-center">
          <div className="w-full max-w-4xl p-4 xl:p-16">{children}</div>
        </main>
      </body>
    </html>
  );
}
