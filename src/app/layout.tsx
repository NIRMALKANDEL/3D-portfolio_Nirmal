import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/data/site";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "Nirmal Kandel",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Developer",
    "Frontend Developer",
    "Next.js Developer",
  ],
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  openGraph: {
    type: "website",
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
    siteName: site.name,
    url: site.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0b" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem('nk-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
