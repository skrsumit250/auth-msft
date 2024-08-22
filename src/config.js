import {getAuth} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBKiLpXvdsGzQa6BxhiPK-RvWl-UmbQSiQ",
    authDomain: "bsbe-archive.firebaseapp.com",
    projectId: "bsbe-archive",
    storageBucket: "bsbe-archive.appspot.com",
    messagingSenderId: "397808708786",
    appId: "1:397808708786:web:1f577f0a25f66e216d2dab",
    measurementId: "G-RHW40NPKNG",
    databaseURL:"https://bsbe-archive-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;