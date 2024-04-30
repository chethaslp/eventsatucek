import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { getEvent, getImgLink } from '@/lib/data'

const inter = Raleway({ subsets: ['latin'] })
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const evnt = (await getEvent(params.id))[0]
 
  return {
    title: evnt[4],
    description: evnt[5],
    openGraph: {
      title: evnt[4],
      images: getImgLink(evnt[6]),
      description: evnt[5],
      type:"article",
      authors:evnt[7]
    },
    twitter:{
      title: evnt[4],
      images: getImgLink(evnt[6]),
      description: evnt[5],
      card:"summary_large_image"
    }
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
