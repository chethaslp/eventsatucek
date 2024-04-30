import { Raleway } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { getEvent } from '@/lib/data'

const inter = Raleway({ subsets: ['latin'] })
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

function getImgLink(link: string) {
  return "/_next/image?w=640&q=75&url=" + encodeURIComponent(
    "https://drive.google.com/uc?export=download&id=" +
    link.replace("https://drive.google.com/open?id=", "")
  );
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  if(!params.id) return {
    title: 'Events@UCEK',
    description: 'An all-in-one place to know about all events at UCEK!',
    icons: "/vercel.svg",
    manifest: "/manifest.json",
    appleWebApp:{
      title: "Events@UCEK",
      statusBarStyle: "black-translucent",
      capable:true,
      startupImage: "/vercel.svg"
    }
  }
  const evnt = (await getEvent(params.id))[0]
 
  return {
    title: evnt[4],
    description: evnt[5],
    icons: getImgLink(evnt[6]),
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
