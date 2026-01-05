import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // We will create this next

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '800'], 
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: '4B4KU5 - Genesis Ritual',
  description: 'Genesis Ritual interface',
  themeColor: '#080808',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <body className={`${inter.variable} ${orbitron.variable} bg-[#080808]`}>
        {/* We wrap children here so the whole app has access to the wallet connection */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
