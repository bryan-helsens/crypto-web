import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFireStore } from 'firebase/firestore';
import firebaseConfig from "./config/firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFireStore(firebaseApp);

export { auth, db };