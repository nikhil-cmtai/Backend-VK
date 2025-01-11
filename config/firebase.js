const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwXRlOphJZczgaxvXw-nuQDQ_T-jI5BB4",
  authDomain: "vk-mishra-6245d.firebaseapp.com",
  projectId: "vk-mishra-6245d",
  storageBucket: "vk-mishra-6245d.firebasestorage.app",
  messagingSenderId: "892569670222",
  appId: "1:892569670222:web:f5696121ac8a309468e91f",
  measurementId: "G-JN2EW4Z9XS"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "vk-mishra-6245d.firebasestorage.app" // Update with your storage bucket
});

// Initialize Admin Storage
const adminStorage = admin.storage();

module.exports = { app, db, adminStorage };