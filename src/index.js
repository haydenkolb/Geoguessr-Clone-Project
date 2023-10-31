
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_UQT0nGeyyH6FeLdp9DhdjlfJfOK2m28",
  authDomain: "robust-tracker-399622.firebaseapp.com",
  projectId: "robust-tracker-399622",
  storageBucket: "robust-tracker-399622.appspot.com",
  messagingSenderId: "568356302154",
  appId: "1:568356302154:web:f89365fccd0df7a2c3a5b3",
  measurementId: "G-4RB1MZYQT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

connectAuthEmulator(auth, "http://localhost:9099");

const loginEmailPassword = async () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  const userCredential = await signInWithEmailAndPassword(auth, emailValue, passwordValue);
  console.log(userCredential.user);
}

const signInForm = document.getElementById('sign-in-form')
signInForm.addEventListener('submit', (event) => {
  // Preventing page refresh
  event.preventDefault()
  loginEmailPassword()
})


onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in!');
  } else {
    console.log('No user');
  }
});

