import './globals.css'
import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // optional but useful if you want var(--font-inter)
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '800'], // include 800 since your CSS uses it
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: '4B4KU5 - Genesis Ritual',
  description: 'Genesis Ritual interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Inter applied to body; Orbitron/Inter exposed as CSS variables */}
      <body className={`${inter.className} ${inter.variable} ${orbitron.variable}`}>
        {children}
      </body>
    </html>
  )
}
