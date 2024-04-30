import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'

const inter = Raleway({ subsets: ['latin'] })


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
