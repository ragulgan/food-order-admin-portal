import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// development
const firebaseConfig = {
  apiKey: "AIzaSyCFRSmjREMMEr2UiyxUNihtEJhhropSnRc",
  authDomain: "food-order-admin-web-new.firebaseapp.com",
  projectId: "food-order-admin-web-new",
  storageBucket: "food-order-admin-web-new.appspot.com",
  messagingSenderId: "273599024015",
  appId: "1:273599024015:web:ac20bac530d1e83c2e19fa",
  measurementId: "G-PR1MMZ2LG1"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
      const currentToken = await getToken(messaging, { vapidKey: 'BKBo4AIgFQVJJdoow7U-LBBD3LQoFS09qYYvv0g_Y_aVsIYo6GfnpAckRMfU-LrHceGUtq3G2XOXssFWGbwhaAs' });
      if (currentToken) {
          localStorage.setItem("FCM", currentToken);
      } else {
          console.log('No registration token available. Request permission to generate one.');
      }
  } catch (err) {
      console.log('An error occurred while retrieving token. ', err);
  }
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});