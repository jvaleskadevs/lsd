import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LSD · Lens Superfluid Dashboard',
  description: 'Lens Superfluid Dashboard or Lens Social Dealer (LSD) is a powerful tool \
                for social payments powered by Superfluid on Lens protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
