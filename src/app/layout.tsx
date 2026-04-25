import "@radix-ui/themes/styles.css";
import "@/styles/main.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Flex, Theme } from "@radix-ui/themes";
import { Footer, Navbar } from "@/components";
// import I18nProvider from "@/providers/I18nProvider";
import { brand } from "@/theme/brand.config";
// import { BuildSiteMap } from "@/utils/sitemap/sitemap.builder";
import { SiteHead } from "@/providers/headLinks";
import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// BuildSiteMap();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={brand.defaultLanguage} className={`${cormorant.variable} ${inter.variable}`}>
      <SiteHead />
      <body>
        {/* <I18nProvider> */}
        <Theme
          appearance={brand.theme.appearance as "light" | "dark"}
          accentColor={brand.theme.accentColor as "bronze"}
          grayColor={brand.theme.grayColor as "sand"}
          radius={brand.theme.radius as "small"}
        >
          <Flex direction="column" minHeight="100vh">
            <Navbar />
            <Flex direction="column" flexGrow="1">
              <main>{children}</main>
              <SpeedInsights />
              <Analytics />
            </Flex>
            <Footer />
          </Flex>
        </Theme>
        {/* </I18nProvider> */}
      </body>
    </html>
  );
}
