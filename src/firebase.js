// Import required Firebase functions
// initializeApp is used to initialize the Firebase application
// getFirestore is used to connect to the Firestore database
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
// These values identify and connect the app to the correct Firebase project
// This configuration is safe to expose in frontend applications
const firebaseConfig = {
  apiKey: "AIzaSyDFDPcTF5UuH70B1fmKABHQdI2SIDuOwn4", // API key for Firebase project
  authDomain: "trashdeal.firebaseapp.com", // Authentication domain
  projectId: "trashdeal", // Firebase project ID
  storageBucket: "trashdeal.firebasestorage.app", // Storage bucket
  messagingSenderId: "370843701400", // Sender ID
  appId: "1:370843701400:web:79ced8c80d3742ce8780ed", // App ID
  measurementId: "G-V2T7J7EHE2", // Analytics ID (not used directly)
};

// Initialize the Firebase application using the configuration above
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
// This database is used to store and retrieve leaderboard scores
export const db = getFirestore(app);
