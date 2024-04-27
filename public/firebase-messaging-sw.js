// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);


const firebaseConfig = {
  apiKey: "AIzaSyAdSmj_Dt2z3KTVDZcprly2GCT_0UGKZOk",
  projectId: "proj-eventsatucek",
  messagingSenderId: "747267605566",
  appId: "1:747267605566:web:e6d8dbb9f4a16dbf2e7d6f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey("BPpBelMiDJmKoVfUm-h_23puTUUsmQuhDV8wSih6vN8e9SjQ-a0gGEMUje_pOzoGPDNxNyLZcvEwmIXEW0iaZ5g");

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.message,
    icon: payload.data.image,
    badge: payload.data.image,
    image: payload.data.image,
    data: { url:payload.data.onClick }, //the url which we gonna use later
  };
  return self.registration.showNotification(notificationTitle,notificationOptions);
});
//Code for adding event on click of notification
self.addEventListener('notificationclick', function(event) {
  let url = event.notification.data.url;
  event.notification.close(); 
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) return client.focus();
        if (clients.openWindow) return clients.openWindow(url);
      }
    })
  );
});