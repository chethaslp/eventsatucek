"use client"

import { useState } from "react";

export default function PWA(){
    const [deferredPrompt, setDeferredPrompt] = useState()

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e)
    });
    
    async function pwainstall() {
        if(deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt.');
            } else if (outcome === 'dismissed') {
                console.log('User dismissed the install prompt');
            }
        }
    }

    return <></>
}
