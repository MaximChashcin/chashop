import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAiGnnMKofya3pXhL28pbIM9o8bgSAWF4",
  authDomain: "chashcin-s-shop.firebaseapp.com",
  projectId: "chashcin-s-shop",
  storageBucket: "chashcin-s-shop.appspot.com",
  messagingSenderId: "561680710544",
  appId: "1:561680710544:web:3a5912240656daa0885115"
};

 // Initialize Firebase
 if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;


export function itemToJSON(doc: { data: () => any; }) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    id: doc.id
  };
}

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;