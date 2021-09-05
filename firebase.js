import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBF6yvhwsjV5TWYLlEXbQB_vQt8Wx-jPlE",
  authDomain: "signal-clone-yt-build-a0afe.firebaseapp.com",
  projectId: "signal-clone-yt-build-a0afe",
  storageBucket: "signal-clone-yt-build-a0afe.appspot.com",
  messagingSenderId: "951685598311",
  appId: "1:951685598311:web:661495e675becb974f18c2"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth, }