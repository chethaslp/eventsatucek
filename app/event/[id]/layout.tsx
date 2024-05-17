import { Raleway } from 'next/font/google'
import { ThemeProvider } from '@/components/context/theme'
import { Toaster } from '@/components/ui/toaster'
import { Metadata, ResolvingMetadata } from 'next'
import { EVNTS_SHEET_ID, getEvent } from '@/lib/data'
import { parse } from 'papaparse'

const inter = Raleway({ subsets: ['latin'] })

function getImgLink(link: string) {
  return "/_next/image?w=640&q=75&url=" + encodeURIComponent(
    "https://drive.google.com/uc?export=download&id=" +
    link.replace("https://drive.google.com/open?id=", "")
  );
}

export async function generateMetadata({params}:{params:{id:string}}): Promise<Metadata> {
  
  const url = "https://docs.google.com/spreadsheets/d/"
              + EVNTS_SHEET_ID
              + "/gviz/tq?tqx=out:csv&sheet=s1&tq=" 
              + encodeURIComponent("select * where `B` = '"+params.id+"' limit 1");
  const data = parse(await (await fetch(url)).text())

  if(!data.data[1]) return {
    metadataBase: new URL('https://eventsatucek.vercel.app'),
    title: "Events@UCEK",
    description: 'An all-in-one place to know about all events at UCEK!',
    icons: "/vercel.svg"}

  const evnt = data.data[1] as Array<string>

 
  return {
    metadataBase: new URL('https://eventsatucek.vercel.app'),
    title: "Events@UCEK - " + evnt[3],
    description: evnt[4],
    icons: "/vercel.svg",
    openGraph: {
      title: evnt[3],
      images: getImgLink(evnt[5]),
      description: evnt[4],
      type:"article",
      authors:evnt[6]
    },
    twitter:{
      title: evnt[3],
      images: getImgLink(evnt[5]),
      description: evnt[4],
      card:"summary_large_image"
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
