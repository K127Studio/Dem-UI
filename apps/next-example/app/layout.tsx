import type { ReactNode } from "react";
import { DemProvider } from "@dem-ui/next";
import { getColorMode } from "@dem-ui/next/server";
import config from "../dem-ui.config";
import "./globals.css";

export const metadata = { title: "Dem UI on Next.js" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemProvider config={config} colorMode={{ defaultMode: await getColorMode() }}>{children}</DemProvider>
      </body>
    </html>
  );
}
