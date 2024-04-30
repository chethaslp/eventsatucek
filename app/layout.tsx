import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { getEvent } from '@/lib/data'

const inter = Raleway({ subsets: ['latin'] })

export const metadata:Metadata = {
    title: 'Events@UCEK',
    description: 'An all-in-one place to know about all events at UCEK!',
    metadataBase: new URL('https://eventsatucek.vercel.app'),
    icons: "/vercel.svg",
    manifest: "/manifest.json",
    appleWebApp:{
      title: "Events@UCEK",
      statusBarStyle: "black-translucent",
      capable: true,
      startupImage: "/vercel.svg"
    }
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
            defaultTheme="dark"
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
