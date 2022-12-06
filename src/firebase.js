import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

//you can either add your firebase config directly like in the tutorial or can also add it as an 
//json string like here https://create-react-app.dev/docs/adding-custom-environment-variables/

// const config = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)

const firebaseConfig = {
    apiKey: "AIzaSyBeQXuhgISuylWKNw915MBkThNA5p5b6d8",
    authDomain: "crypto-chess-1e9ae.firebaseapp.com",
    projectId: "crypto-chess-1e9ae",
    storageBucket: "crypto-chess-1e9ae.appspot.com",
    messagingSenderId: "934046095784",
    appId: "1:934046095784:web:f09244e911c292449d659d",
    measurementId: "G-RZ098DE2BH"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const auth = firebase.auth()
export default firebase