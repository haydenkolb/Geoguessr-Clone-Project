import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD_UQT0nGeyyH6FeLdp9DhdjlfJfOK2m28',
  authDomain: 'robust-tracker-399622.firebaseapp.com',
  projectId: 'robust-tracker-399622',
  storageBucket: 'robust-tracker-399622.appspot.com',
  messagingSenderId: '568356302154',
  appId: '1:568356302154:web:f89365fccd0df7a2c3a5b3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const submitTypeInput = document.getElementById('submit-type');

// Set submitTypeInput's value when sign-in-button is clicked
document.getElementById('sign-in-button').addEventListener('click', () => {
  submitTypeInput.value = 'sign-in';
});

// Set submitTypeInput's value when register-button is clicked
document.getElementById('register-button').addEventListener('click', () => {
  submitTypeInput.value = 'register';
});

// Handle submit event from signInForm
const signInForm = document.getElementById('sign-in-form');
signInForm.addEventListener('submit', (event) => {
  // Preventing page refresh
  event.preventDefault();
  // Get the email and password input fields
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Case of sign-in being pressed
  if (submitTypeInput.value === 'sign-in') {
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then((userCredential) => {
        // Signed in user
        const { user } = userCredential;
        console.log('Signed in user', user);

        // Hide auth container and display the game mode selection container
        const authContainer = document.getElementById('authContainer');
        authContainer.style.display = 'none';
        const gameModeContainer = document.getElementById('gameModeContainer');
        gameModeContainer.style.display = 'block';
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });

  // Case of register being pressed
  } else if (submitTypeInput.value === 'register') {
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then((userCredential) => {
        // Newly registered user signed up
        const { user } = userCredential;
        console.log(user);
        console.log(userCredential);

        // Hide auth container and display the game mode selection container
        const authContainer = document.getElementById('authContainer');
        authContainer.style.display = 'none';
        const gameModeContainer = document.getElementById('gameModeContainer');
        gameModeContainer.style.display = 'block';
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
});
