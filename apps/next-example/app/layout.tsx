import type { ReactNode } from "react";
import { DemProvider } from "@dem-ui/next";
import neobrutalism from "@dem-ui/theme-neobrutalism";
import "./globals.css";

export const metadata = { title: "Dem UI on Next.js" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemProvider theme={neobrutalism}>{children}</DemProvider>
      </body>
    </html>
  );
}
