"use client";

import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { useAuthContext } from "@/components/context/auth";
import { app } from "@/components/fb/config";
import { Card, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar"
import { genericConverter, QuestMetadata } from "@/lib/models";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

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
            <div>
                <Card>
                    <CardHeader></CardHeader>
                </Card>
            </div>
        </main>
    </div>:
    <NotFound p={window.location.href}/>:
    <Loading msg="Loading Quest..."/>


}