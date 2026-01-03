import type { Metadata } from 'next/metadata';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css'; // 1. Moved here from outside (Next.js best practice)

// 2. Configure Inter to output a CSS variable (cleaner usage)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// 3. Added weight '800' because your CSS uses it for bold titles
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '800'], 
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: '4B4KU5 - Genesis Ritual',
  description: 'Genesis Ritual interface',
  // 4. Optional: Add theme color so mobile browser bar matches your black background
  themeColor: '#080808',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 5. Explicit Head for viewport and theme */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      {/* 6. Apply fonts via CSS variables for global access */}
      <body className={`${inter.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  );
}
