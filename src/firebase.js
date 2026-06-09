// Import required Firebase functions
// initializeApp is used to initialize the Firebase application
// getFirestore is used to connect to the Firestore database
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
// These values identify and connect the app to the correct Firebase project
// This configuration is safe to expose in frontend applications
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase application using the configuration above
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
// This database is used to store and retrieve leaderboard scores
export const db = getFirestore(app);
