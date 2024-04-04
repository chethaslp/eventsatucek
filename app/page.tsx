"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import Loading from './loading';
import { BentoGrid, BentoGridItem } from '@/components/ui/card-grid';

function getImgLink(link:string){
  return "https://drive.google.com/uc?export=download&id="+link.replace("https://drive.google.com/open?id=","")
}

export default function Home() {

  const { toast } = useToast()
  const [data, setData] = useState<string[]>([]);
  const url = "https://docs.google.com/spreadsheets/d/1jrpjxOBA4kVCLgrrjjLt46bmNCRDaruuJvcU3JwvOkc/gviz/tq?tqx=out:csv&sheet=s1"

  useEffect(()=>{
    Papa.parse<string>(url, {
      download: true,
      skipEmptyLines: true,
      complete(results) {
        let d = results.data
        delete d[0]
        setData(d);
        console.log(d)
      },
    })
},[])

  return (data.length == 0)? <Loading msg='Loading...'/>:
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <main className="flex flex-col h-full w-full p-5">
      <div className='mb-5'>
        <CardTitle>Upcoming Events</CardTitle>
        </div>
      <BentoGrid className="max-w-4xl mx-auto">
        {data.map((evnt,i)=>(
            <BentoGridItem
              key={i}
              title={evnt[2]}
              description={evnt[3]}
              header={<Image  width={500} height={100} referrerPolicy={"no-referrer"} src={getImgLink(evnt[4])} alt='Event Poster'></Image>}
              icon={<div>{evnt[6]}</div>}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
    </BentoGrid>
      </main>
    </div>
    
}
