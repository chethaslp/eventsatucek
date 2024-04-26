import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'

const inter = Raleway({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Events@UCEK',
  description: 'A all-in-one place to know about all events at UCEK!',
  icons: "/vercel.svg",
  manifest: "/manifest.json"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-screen'>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
                <Toaster/>
                {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
