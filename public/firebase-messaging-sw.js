importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
//production
// const firebaseConfig = {
//   apiKey: "AIzaSyCw2sufBrTTkOPf5u9lQrYru0kkzKjCoX8",
//   authDomain: "food-order-admin-production.firebaseapp.com",
//   projectId: "food-order-admin-production",
//   storageBucket: "food-order-admin-production.appspot.com",
//   messagingSenderId: "928632377240",
//   appId: "1:928632377240:web:ff691bc585be969e1da5ed",
//   measurementId: "G-4CG3V6NZ74"
// };

// Initialize the Firebase app in the service worker by passing the generated config
//development
const firebaseConfig = {
    apiKey: "AIzaSyCFRSmjREMMEr2UiyxUNihtEJhhropSnRc",
    authDomain: "food-order-admin-web-new.firebaseapp.com",
    projectId: "food-order-admin-web-new",
    storageBucket: "food-order-admin-web-new.appspot.com",
    messagingSenderId: "273599024015",
    appId: "1:273599024015:web:ac20bac530d1e83c2e19fa",
    measurementId: "G-PR1MMZ2LG1"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});