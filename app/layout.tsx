import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: '4B4KU5 - Genesis Ritual',
  description: 'Genesis Ritual interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* apply Inter to body; expose Orbitron as CSS variable */}
      <body className={`${inter.className} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}
