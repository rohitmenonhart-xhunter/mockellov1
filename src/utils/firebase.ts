import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCuWTdQuHs_l6rvfzaxvY4y-Uzn0EARRwM",
  authDomain: "athentication-3c73e.firebaseapp.com",
  databaseURL: "https://athentication-3c73e-default-rtdb.firebaseio.com",
  projectId: "athentication-3c73e",
  storageBucket: "athentication-3c73e.firebasestorage.app",
  messagingSenderId: "218346867452",
  appId: "1:218346867452:web:58a57b37f6b6a42ec72579",
  measurementId: "G-3GBM5TSMLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }; 