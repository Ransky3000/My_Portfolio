import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConditionalNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
