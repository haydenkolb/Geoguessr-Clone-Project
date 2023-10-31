import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuQ7U43ZcNkLoBmSLTpK4JoQnqw8Le67c",
  authDomain: "fir-auth-test-a173f.firebaseapp.com",
  projectId: "fir-auth-test-a173f",
  storageBucket: "fir-auth-test-a173f.appspot.com",
  messagingSenderId: "501028274527",
  appId: "1:501028274527:web:e397e4e50499746ff4b6ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signInForm = document.getElementById('sign-in-form')
signInForm.addEventListener('submit', (event) => {
  // Preventing page refresh
  event.preventDefault()
  
  const emailInput = document.getElementById('email')
  const passwordInput = document.getElementById('password')
  // for now only sign up a user
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user)
    console.log(userCredential)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    // ..
  });
})

