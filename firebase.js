// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1pAuVYh0iPl-zD0tKZIPu8iOuYnHQWrA",
  authDomain: "udhaar-56deb.firebaseapp.com",
  projectId: "udhaar-56deb",
  storageBucket: "udhaar-56deb.appspot.com",
  messagingSenderId: "52404169921",
  appId: "1:52404169921:web:146a43ed2c6eea2f0df840",
  measurementId: "G-C7X3QMSSLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app,analytics}