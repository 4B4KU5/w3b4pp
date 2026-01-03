import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css' // This now contains your html/body styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  weight: ['500', '700', '800'],
  variable: '--font-orbitron' 
})

export const metadata: Metadata = {
  title: '4B4KU5',
  description: 'Genesis Ritual',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Apply Inter to body, Orbitron via CSS variable */}
      <body className={`${inter.variable} ${orbitron.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
