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

// Sign in form submitTypeInput holds value of submitted method (sign in / register)
const submitTypeInput = document.getElementById('submit-type');

// Set submitTypeInput's value when sign-in-button is clicked
document.getElementById('sign-in-button').addEventListener('click', () => {
  submitTypeInput.value = 'sign-in';
});

// Set submitTypeInput's value when register-button is clicked
document.getElementById('register-button').addEventListener('click', () => {
  submitTypeInput.value = 'register';
});

// Declaration of street view service, map, panorama, and guessMarker variables.
let sv;
let map;
let panorama;
let guessMarker;

// Places a marker on the guessing map when clicked
function placeGuessMarker(latLng, map) {
  // If a marker has been placed already, get rid of it and create a new marker.
  if (guessMarker !== undefined) {
    guessMarker.setMap(null);
    guessMarker = undefined;
  }
  // Place a new marker on the guessing map
  guessMarker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  console.log(`Guess marker lat: ${latLng.lat()}`);
  console.log(`Guess marker lng: ${latLng.lng()}`);
}

// Callback function for Google maps API
async function initialize() {
  /* eslint disable */
  sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'),
  );

  // Disable the road names that are displayed in the panoramic street view by default
  panorama.setOptions({
    showRoadLabels: false,
    addressControl: false,
  });

  // Set up the guessing map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 1,
    streetViewControl: false,
    disableDefaultUI: true,
  });

  // Add click event listener for placing guess marker
  map.addListener('click', (e) => {
    placeGuessMarker(e.latLng, map);
  });
}
window.initialize = initialize;

// Generates a random set of coordinates and creates a LatLng location
async function getRandomLocation() {
  const minLat = -90; // Minimum latitude
  const maxLat = 90; // Maximum latitude
  const minLng = -180; // Minimum longitude
  const maxLng = 180; // Maximum longitude
  const randomLat = Math.random() * (maxLat - minLat) + minLat;
  const randomLng = Math.random() * (maxLng - minLng) + minLng;
  const location = await new google.maps.LatLng(randomLat, randomLng);
  return location;
}

// Find a panorama given a set of coordinates and a radius
async function processSVData(loc, rad) {
  return new Promise((resolve, reject) => {
    sv.getPanorama({ location: loc, radius: rad }, async (data, status) => {
      console.log(status);
      if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
        // If there are no panoramic street views at this spot, retry with a higher radius
        resolve(await processSVData(loc, rad * 10));
      } else if (status === google.maps.StreetViewStatus.OK) {
        console.log(data);
        console.log(data.copyright);
        // A panoramic street view was found, create the panorama & send the updated coordinates
        const newLatLng = data.location.latLng;
        const newLat = newLatLng.lat();
        const newLng = newLatLng.lng();
        panorama.setPano(data.location.pano);
        panorama.setPov({
          heading: 270,
          pitch: 0,
        });
        panorama.setVisible(true);
        resolve({ newLat, newLng });
      } else {
        console.error('Error getting panoramic street view');
        reject(new Error('Error getting panoramic street view'));
      }
    });
  });
}

async function playSoloGame(roundDuration, round) {
  // TODO
  // Run the game with specified roundDuration & increment round after each round ends

  // Generate a random location for this round
  const location = await getRandomLocation();
  console.log(`Generated Location ${location}`);

  // Display the map and panorama
  const map = document.getElementById('map');
  map.style.display = 'block';
  const panorama = document.getElementById('pano');
  panorama.style.display = 'block';

  // Find a panoramic street view given the generated location and initial search radius of 100
  const locationData = await processSVData(location, 100);

  // Store the latitude & longitude values for the panoramic street view location that was found
  const latitude = locationData.newLat;
  const longitude = locationData.newLng;
  console.log(`New lat ${latitude}`);
  console.log(`New lng ${longitude}`);
}
// Game mode selection form gameModeTypeInput holds value of submitted game type
const gameModeTypeInput = document.getElementById('mode-type');

// Get user selected game mode
function getGamemode() {
  // Hide auth container and display the game mode selection form and add event listeners
  const signInForm = document.getElementById('sign-in-form');
  signInForm.style.display = 'none';
  const gameModeForm = document.getElementById('game-mode-form');
  gameModeForm.style.display = 'block';

  // Event listeners for game mode selection buttons
  document.getElementById('normal-diff').addEventListener('click', () => {
    gameModeTypeInput.value = 'normal-solo';
  });
  document.getElementById('hard-diff').addEventListener('click', () => {
    gameModeTypeInput.value = 'hard-solo';
  });
  document.getElementById('expert-diff').addEventListener('click', () => {
    gameModeTypeInput.value = 'expert-solo';
  });
  document.getElementById('battle-royale').addEventListener('click', () => {
    gameModeTypeInput.value = 'battle-royale';
  });
  document.getElementById('hide-and-seek').addEventListener('click', () => {
    gameModeTypeInput.value = 'hide-and-seek';
  });

  // Submit event listener for gamemode selection form
  gameModeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(gameModeTypeInput.value);
    const gameMode = gameModeTypeInput.value;
    let roundDuration;

    // Hide the game mode form
    gameModeForm.style.display = 'none';

    // Determine round duration for the solo game mode & handle case for multiplayer modes selection
    switch (gameMode) {
      case 'normal-solo':
        roundDuration = 120;
        playSoloGame(roundDuration, 1);
        break;
      case 'hard-solo':
        roundDuration = 60;
        playSoloGame(roundDuration, 1);
        break;
      case 'expert-solo':
        roundDuration = 30;
        playSoloGame(roundDuration, 1);
        break;
      case 'battle-royale':
        // TODO
        // Display the lobby selection page & host lobby button
        break;
      case 'hide-and-seek':
        // TODO
        // Display the lobby selection page & host lobby button
        break;
      default:
        console.log('default case');
        break;
    }
  });
}

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

        // Get user entered gamemode
        getGamemode();
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

        // Get user entered gamemode
        getGamemode();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
});
