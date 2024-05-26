import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { getEvent } from '@/lib/data'
import { AuthContextProvider } from '@/components/context/auth'
import { cn } from '@/lib/utils'

const inter = Raleway({ subsets: ['latin'] })

export const metadata:Metadata = {
    title: 'Events@UCEK',
    description: 'An all-in-one place to know about all events at UCEK!',
    metadataBase: new URL('https://eventsatucek.vercel.app'),
    icons: "/icon512_rounded.png",
    manifest: "/manifest.json",
    appleWebApp:{
      title: "Events@UCEK",
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
