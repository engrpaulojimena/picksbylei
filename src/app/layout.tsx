import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lei's Picks | TikTok Affiliate Finds",
  description: "All of Lei's TikTok-reviewed products — curated, honest, and worth every peso!",
  openGraph: {
    title: "Lei's Picks | TikTok Affiliate Finds",
    description: "Curated TikTok Shop finds by Lei — real reviews, best deals!",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = cookies().get("admin_session")?.value === "authenticated";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('lei-theme');
                  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Navbar isAdmin={isAdmin} />
        <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
