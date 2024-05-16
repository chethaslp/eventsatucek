"use client"

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { PUBLIC_KEY } from "@/lib/data";
import { useEffect, useState } from "react";
import { register } from "register-service-worker";
import { useToast } from "./use-toast";
import { app } from "../fb/config";

export default function FCM(){
    const toast = useToast();
    
    useEffect(() => {
        function reqNotification() {
          // Requesting permission using Notification API
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Getting FCM Token
              register("/firebase-messaging-sw.js", {
                registrationOptions: {
                  scope: "/firebase-cloud-messaging-push-scope",
                },
                ready(registration) {
                  console.log("ServiceWorker is active now.");
                },
                error(error) {
                  console.error("Error during service worker registration:", error);
                },
                registered(reg) {
                  console.log("Registered ServiceWorker.");
                  getToken(getMessaging(app), {
                    vapidKey: PUBLIC_KEY,
                  })
                    // Sending FCM Token to the server
                    .then((token) => {
                      if (localStorage.getItem("sw-registered") !== "1") {
                        fetch("/api/addSubscriber", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json", // Set Content-Type header
                          },
                          body: JSON.stringify({ token }), // Stringify token object
                        })
                          .then((resp) => {
                            console.log(resp);
                            localStorage.setItem("sw-registered", "1");
                          })
                          .catch((error) => {
                            console.error("Error sending token to server:", error);
                          });
                      }
                    })
                    .catch((error) => {
                      console.error("Error getting FCM Token:", error);
                    });
                },
              });
            } else if (permission === "denied") {
              if (localStorage.getItem("sw-registered") !== "0") {
                localStorage.setItem("sw-registered", "0");
                alert(
                  "Please accept the notification for receiving Live Updates about Events at UCEK."
                );
              }
            }
          });
        }
    
        if (window.Notification) reqNotification();
      }, []);
    
      useEffect(() => {
        onMessage(getMessaging(app), (payload) => {
          toast.toast({
            title: "New Event Published!",
            description: "Refresh the page to view now.",
          });
        });
      });
    return null
}
