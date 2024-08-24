import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { AuthContextProvider } from '@/components/context/auth'
import { cn } from '@/lib/utils'

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Raleway({ subsets: ['latin'] })

export const metadata:Metadata = {
    title: 'UCKevents',
    description: 'An all-in-one place to know about all events at UCEK!',
    metadataBase: new URL('https://eventsatucek.vercel.app'),
    icons: "/icon512_rounded.png",
    manifest: "/manifest.json",
    appleWebApp:{
      title: "UCKevents",
      statusBarStyle: "black-translucent",
      capable: true,
      startupImage: "/icon512_rounded.png"
    }
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en" className='h-screen'>
      <body className= {cn(inter.className, "h-[100dvh] w-[100dvw] overflow-x-hidden")}>
        <Analytics/>
        <SpeedInsights/>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
             <AuthContextProvider>
                <Toaster/>
                {children}
              </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
