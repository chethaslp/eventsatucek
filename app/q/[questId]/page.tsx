"use client";

import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { useAuthContext } from "@/components/context/auth";
import { app } from "@/components/fb/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar"
import { genericConverter, QuestMetadata } from "@/lib/models";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, query, where } from "firebase/firestore";
import { url } from "inspector";
import { useEffect, useState } from "react";
import { Pixelify_Sans } from 'next/font/google'
import { Separator } from "@/components/ui/separator";

const font = Pixelify_Sans({ subsets: ['latin'], weight: ['400']})

export default function Home({ params }: {params: {questId:string}}) {

    const [qData, setQData] = useState<Partial<QuestMetadata> | 404>()
    const qid = params.questId
    const user:User|null = useAuthContext()

    useEffect(()=>{
        user?.getIdToken()
        .then((s) => fetch(`/api/quest/${qid}?token=${s}`,{
                headers: { "Content-Type": "application/json",},
                method:'GET'
            }))
        .then(async (resp)=>{
            if(resp.ok){
                setQData(await resp.json())
            }else{
                setQData(404)
            }
        })
},[])

    return (qData)? (qData != 404)?<div className="flex w-full h-full flex-col">
        <Navbar qName={qData?.name} />
        <main className="flex items-center justify-center">
            <>
                <Card className="w-full m-4">
                    <CardHeader style={{
                        background : `url("/img/quest_bg.jpg")`
                    }} className="flex-row justify-between">
                        <CardTitle className={`${font.className} text-5xl text-white`}> {qData?.name} </CardTitle>
                        <div className={`${font.className} text-black bg-white rounded-md pl-2 pr-2 flex items-center gap-2`}> <span className="text-green-600 text-2xl">●</span> Live</div>
                    </CardHeader>
                    <CardContent className="mt-3">
                        <Card className="text-slate-400">
                            <span className="p-4">Description</span>
                            <Separator orientation="horizontal"/>
                            <div className="p-3">
                                {qData.desc}
                            </div>
                            
                        </Card>
                        <div></div>
                    </CardContent>
                </Card>
            </>
        </main>
    </div>:
    <NotFound p={window.location.href}/>:
    <Loading msg="Loading Quest..."/>


}



11/1/24