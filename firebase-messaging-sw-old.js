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

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    title: payload.notification.title,
    body: payload.notification.body,
    icon: "/vercel.svg",
    image: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener('notificationclick', (event) => {
//   if (event.notification.data && event.notification.data.click_action) {
//     self.clients.openWindow(event.notification.data.click_action);
//   } else {
//     self.clients.openWindow(event.currentTarget.origin);
//   }
  
//   // close notification after click
//   event.notification.close();
// });