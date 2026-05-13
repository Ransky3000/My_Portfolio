import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { supabase } from "@/lib/supabase";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ranian | Developer Portfolio',
  description: 'Computer Engineer & AI Automation Developer specializing in embedded systems, web development, and research.',
  openGraph: {
    title: 'Ranian | Developer Portfolio',
    description: 'Computer Engineer & AI Automation Developer specializing in embedded systems, web development, and research.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await supabase.from('site_settings').select('site_title').single();
  const initialSiteTitle = data?.site_title || 'Ranian';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConditionalNavbar initialSiteTitle={initialSiteTitle} />
        <main>{children}</main>
      </body>
    </html>
  );
}
