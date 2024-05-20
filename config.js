import firebase from "firebase/compat/app";
import { getDatabase, ref } from "@firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCiBYgnFxAXKBRIgxO-rUEJyMDTFbH5PHs",
  authDomain: "wheel-f5238.firebaseapp.com",
  databaseURL: "https://wheel-f5238-default-rtdb.firebaseio.com",
  projectId: "wheel-f5238",
  storageBucket: "wheel-f5238.appspot.com",
  messagingSenderId: "851756482678",
  appId: "1:851756482678:web:28cfcdbeb18eeab3b1df57",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();
export { firebase, db };
