import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: 'Nano Signs | Premium LED Display Solutions',
  description: 'Industry-leading LED display technology and solutions. Outdoor, indoor, creative, rental, and custom neon LED displays for any application.',
  generator: 'Nano Signs Engine',
  keywords: ['Nano Signs', 'LED Display', 'Neon Signs', 'Digital Signage', 'Outdoor LED', 'Indoor LED', 'Rental LED'],
  authors: [{ name: 'Nano Signs Team' }],
  metadataBase: new URL('https://nano-signs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nano Signs | Premium LED Display Solutions',
    description: 'Elevate your brand with high-impact LED displays and custom neon signage.',
    url: 'https://nano-signs.com',
    siteName: 'Nano Signs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nano Signs Portfolio Showcase',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nano Signs | Premium LED Display Solutions',
    description: 'Elevate your brand with high-impact LED displays and custom neon signage.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/webicon.png',
        sizes: 'any',
      },
      {
        url: '/webicon.png',
        type: 'image/png',
      },
    ],
    apple: '/webicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CartProvider>
            {children}
            <Analytics />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
