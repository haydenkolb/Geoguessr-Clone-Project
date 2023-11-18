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
let locationMarker;

// Declaration of latitude and longitude variables
let newLat;
let newLng;
let guessLat;
let guessLng;

// Calculate the score given the distance from the location
function calculateScore(distance) {
  const maxScore = 5000;
  const maxDistance = 5000;

  const score = maxScore * (1 - distance / maxDistance);
  return Math.max(0, Math.round(score));
}

// Helper function for haversine distance
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// Haversine distance function returns the distance of the guess to the actual location
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1))
   * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

// Guessing button
const guessButton = document.getElementById('guess-button');

// Score overlay
const scoreOverlay = document.getElementById('score-overlay');

// Timer
const timer = document.getElementById('timer');

const timeRemaining = document.getElementById('time-remaining');
let intervalId;

// Timer function displays the time left
function startTimer(roundDuration, onEnd) {
  let time = roundDuration;
  let minutes;
  let seconds;

  intervalId = setInterval(() => {
    minutes = parseInt(time / 60, 10);
    seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timeRemaining.innerHTML = `${minutes}:${seconds}`;

    if (time <= 0) {
      clearInterval(intervalId);
      onEnd();
    }
    time -= 1;
  }, 1000);
}

// Function stops the timer
function stopTimer() {
  if (intervalId !== undefined) {
    console.log(`Stopping timer ${intervalId}`);
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

// Places a marker on the guessing map when clicked
function placeGuessMarker(latLng) {
  // If a marker has been placed already, get rid of it and create a new marker.
  if (guessButton.style.display !== 'block') {
    guessButton.style.display = 'block';
  }
  if (guessMarker !== undefined) {
    guessMarker.setMap(null);
    guessMarker = undefined;
  }
  // Place a new marker on the guessing map
  // eslint-disable-next-line no-undef
  guessMarker = new google.maps.Marker({
    position: latLng,
    map,
    icon: 'icons/map-marker.png',
  });
  console.log(`Guess marker lat: ${latLng.lat()}`);
  console.log(`Guess marker lng: ${latLng.lng()}`);
  guessLat = latLng.lat();
  guessLng = latLng.lng();
}

// Callback function for Google maps API
async function initialize() {
  // eslint-disable-next-line no-undef
  sv = new google.maps.StreetViewService();
  // eslint-disable-next-line no-undef
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'),
  );
  // Disable the road names that are displayed in the panoramic street view by default
  panorama.setOptions({
    showRoadLabels: false,
    addressControl: false,
  });
  // Set up the guessing map
  // eslint-disable-next-line no-undef
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 1,
    streetViewControl: false,
    disableDefaultUI: true,
    clickableIcons: false,
  });
  // Add click event listener for placing guess marker & display the 'Make Guess' button
  map.addListener('click', (e) => {
    placeGuessMarker(e.latLng);
  });
}
window.initialize = initialize;

// Check if the randomly generated location is on land
async function isLandLocation(lat, lng) {
  // Call the reverse geocoding API and check the response for the given location
  const apiKey = 'AIzaSyD_UQT0nGeyyH6FeLdp9DhdjlfJfOK2m28';
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
  );
  const data = await response.json();
  console.log(data);
  const isLand = data.results.length > 0 && (data.results[0].address_components.length > 1);
  console.log(`isLand: ${isLand}`);
  return isLand;
}

// Generates a random set of coordinates and creates a LatLng location
async function getRandomLocation() {
  const minLat = -90; // Minimum latitude
  const maxLat = 90; // Maximum latitude
  const minLng = -180; // Minimum longitude
  const maxLng = 180; // Maximum longitude
  let randomLat;
  let randomLng;
  // Generate a location that is on land
  do {
    randomLat = Math.random() * (maxLat - minLat) + minLat;
    randomLng = Math.random() * (maxLng - minLng) + minLng;
  // eslint-disable-next-line no-await-in-loop
  } while (!(await isLandLocation(randomLat, randomLng)));
  // eslint-disable-next-line no-undef
  const location = await new google.maps.LatLng(randomLat, randomLng);
  return location;
}

// Find a panorama given a set of coordinates and a search radius
async function processSVData(loc, rad) {
  return new Promise((resolve, reject) => {
    sv.getPanorama({ location: loc, radius: rad }, async (data, status) => {
      console.log(status);
      // eslint-disable-next-line no-undef
      if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
        // If there are no panoramic street views at this spot, retry with a higher radius
        resolve(await processSVData(loc, rad * 10));
      // eslint-disable-next-line no-undef
      } else if (status === google.maps.StreetViewStatus.OK) {
        console.log(data);
        // A panoramic street view was found, create the panorama & send the updated coordinates
        const newLatLng = data.location.latLng;
        newLat = newLatLng.lat();
        newLng = newLatLng.lng();
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

// Initialize MAX_ROUNDS
const MAX_ROUNDS = 5;

// Initialize roundScore
let roundScore;

// Get the elements from the page
const roundScoreP = document.getElementById('round-score');
const distanceP = document.getElementById('distance');
const gameContainer = document.getElementById('game-container');
const originalMap = document.getElementById('map');
const mapDiv = document.getElementById('map');
const panoramaDiv = document.getElementById('pano');
const playAgainButton = document.getElementById('play-again');

// Store the initial layout of the map for rearranging later
const initialPosition = {
  position: originalMap.style.position,
  top: originalMap.style.top,
  left: originalMap.style.left,
  transform: originalMap.style.transform,
  bottom: originalMap.style.bottom,
  right: originalMap.style.right,
};

function endSoloGame(scoreAccumulated) {
  timer.style.display = 'none';
  guessButton.style.display = 'none';
  scoreOverlay.style.display = 'block';
  mapDiv.style.display = 'none';
  distanceP.innerHTML = '';
  playAgainButton.style.display = 'block';

  roundScoreP.innerHTML = `Game over.<br>Your score for this game is <span style="color:purple">${scoreAccumulated}</span>`;
  function handlePlayAgain() {
    scoreOverlay.style.display = 'none';
    playAgainButton.style.display = 'none';
    // eslint-disable-next-line no-use-before-define
    getGamemode();
    playAgainButton.removeEventListener('click', handlePlayAgain);
  }
  playAgainButton.addEventListener('click', handlePlayAgain);
}

async function playSoloGame(roundDuration, round, scoreAccumulated) {
  // Add the event listener to the make guess button
  // eslint-disable-next-line no-use-before-define
  guessButton.addEventListener('click', handleGuessClick);
  console.log(`playSoloGame called with roundDuration, round, scoreAccumulated\n ${roundDuration} , ${round} , ${scoreAccumulated}`);

  // Display the map and panorama
  mapDiv.style.display = 'block';
  panoramaDiv.style.display = 'flex';

  // Generate a new location
  const location = await getRandomLocation();

  // Obtain a panoramic view
  const locationData = await processSVData(location, 100);

  // Display and reset timer
  timer.style.display = 'block';
  stopTimer();

  // Store latitude and logitude of the actual location for placing locationMarker
  // eslint-disable-next-line no-unused-vars
  const latitude = locationData.newLat;
  // eslint-disable-next-line no-unused-vars
  const longitude = locationData.newLng;

  // Initialize roundScore
  roundScore = 0;

  // Create a dynamic event listener for the make guess button
  // Function executes when make guess button is clicked
  function handleGuessClick() {
    stopTimer();
    guessButton.removeEventListener('click', handleGuessClick);

    const distance = haversineDistance(newLat, newLng, guessLat, guessLng);
    guessLat = undefined;
    guessLng = undefined;
    roundScore = calculateScore(distance);
    timer.style.display = 'none';
    guessButton.style.display = 'none';
    scoreOverlay.style.display = 'block';
    // eslint-disable-next-line no-param-reassign
    scoreAccumulated += roundScore;
    roundScoreP.innerHTML = `Score for this round is <span style="color:purple">${roundScore}</span><br>Your overall score is <span style="color:purple">${scoreAccumulated}</span>`;
    // Move the map to the scoreOverlay
    scoreOverlay.appendChild(originalMap);
    originalMap.style.position = 'absolute';
    originalMap.style.top = '60%';
    originalMap.style.left = '50%';
    originalMap.style.transform = 'translate(-50%, -50%)';

    // Add the locationMarker and pan to it
    // eslint-disable-next-line no-undef
    locationMarker = new google.maps.Marker({
      position: location,
      map,
    });
    map.panTo(locationMarker.position);
    distanceP.innerHTML = `Guess was <span style="color:purple">${Math.round(distance)}</span> km away from the location`;

    // After 5 second intermission between rounds, reset the page and play next round
    setTimeout(() => {
      scoreOverlay.style.display = 'none';
      timer.style.display = 'block';
      locationMarker.setMap(null);
      locationMarker = undefined;
      if (guessMarker !== undefined) {
        guessMarker.setMap(null);
        guessMarker = undefined;
      }
      gameContainer.appendChild(originalMap);
      originalMap.style.position = initialPosition.position;
      originalMap.style.top = initialPosition.top;
      originalMap.style.left = initialPosition.left;
      originalMap.style.transform = initialPosition.transform;
      originalMap.style.bottom = initialPosition.bottom;
      originalMap.style.right = initialPosition.right;

      if (round < MAX_ROUNDS) {
        playSoloGame(roundDuration, round + 1, scoreAccumulated);
      } else {
        endSoloGame(scoreAccumulated);
      }
    }, 5000);
  }

  startTimer(roundDuration, () => {
    // Callback function executes when make guess button is not clicked during the round
    stopTimer();
    guessButton.removeEventListener('click', handleGuessClick);
    timer.style.display = 'none';
    guessButton.style.display = 'none';
    scoreOverlay.style.display = 'block';
    // If there is a guess marker placed but the button was not pressed, score that guess
    if (guessLat !== undefined && guessLng !== undefined) {
      const distance = haversineDistance(newLat, newLng, guessLat, guessLng);
      guessLat = undefined;
      guessLng = undefined;
      roundScore = calculateScore(distance);
      // eslint-disable-next-line no-param-reassign
      scoreAccumulated += roundScore;
      roundScoreP.innerHTML = `Score for this round is <span style="color:purple">${roundScore}</span><br>Your overall score is <span style="color:purple">${scoreAccumulated}</span>`;

      scoreOverlay.appendChild(originalMap);
      originalMap.style.position = 'absolute';
      originalMap.style.top = '50%';
      originalMap.style.left = '50%';
      originalMap.style.transform = 'translate(-50%, -50%)';
      // Add the locationMarker and pan to it
      // eslint-disable-next-line no-undef
      locationMarker = new google.maps.Marker({
        position: location,
        map,
      });
      map.panTo(locationMarker.position);
      distanceP.innerHTML = `Guess was <span style="color:purple">${Math.round(distance)}</span> km away from the location`;
    } else {
      roundScoreP.innerHTML = 'Guessing time ran out!';
      scoreOverlay.appendChild(originalMap);
      originalMap.style.position = 'absolute';
      originalMap.style.top = '60%';
      originalMap.style.left = '50%';
      originalMap.style.transform = 'translate(-50%, -50%)';
      // eslint-disable-next-line no-undef
      locationMarker = new google.maps.Marker({
        position: location,
        map,
      });
      map.panTo(locationMarker.position);
      distanceP.innerHTML = '';
    }
    // After 5 second intermission between rounds, reset the page and play next round
    setTimeout(() => {
      scoreOverlay.style.display = 'none';
      timer.style.display = 'block';
      gameContainer.appendChild(originalMap);
      locationMarker.setMap(null);
      locationMarker = undefined;
      if (guessMarker !== undefined) {
        guessMarker.setMap(null);
        guessMarker = undefined;
      }
      originalMap.style.position = initialPosition.position;
      originalMap.style.top = initialPosition.top;
      originalMap.style.left = initialPosition.left;
      originalMap.style.transform = initialPosition.transform;
      originalMap.style.bottom = initialPosition.bottom;
      originalMap.style.right = initialPosition.right;

      if (round < MAX_ROUNDS) {
        playSoloGame(roundDuration, round + 1, scoreAccumulated);
      } else {
        endSoloGame(scoreAccumulated);
      }
    }, 5000);
  });
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

  // Hide the map, panorama, and play again button
  mapDiv.style.display = 'none';
  panoramaDiv.style.display = 'none';
  playAgainButton.style.display = 'none';

  // Get the buttons
  const normalDiffButton = document.getElementById('normal-diff');
  const hardDiffButton = document.getElementById('hard-diff');
  const expertDiffButton = document.getElementById('expert-diff');
  const battleRoyaleButton = document.getElementById('battle-royale');
  const hideAndSeekButton = document.getElementById('hide-and-seek');

  // Define the event listener functions for the buttons
  function handleNormalDiff() {
    gameModeTypeInput.value = 'normal-solo';
  }
  function handleHardDiff() {
    gameModeTypeInput.value = 'hard-solo';
  }
  function handleExpertDiff() {
    gameModeTypeInput.value = 'expert-solo';
  }
  function handleBattleRoyale() {
    gameModeTypeInput.value = 'battle-royale';
  }
  function handleHideAndSeek() {
    gameModeTypeInput.value = 'hide-and-seek';
  }

  // Game mode form submit event handler function
  function handleSubmit(event) {
    // Function removes the event listeners for each button
    function removeEventListeners() {
      normalDiffButton.removeEventListener('click', handleNormalDiff);
      hardDiffButton.removeEventListener('click', handleHardDiff);
      expertDiffButton.removeEventListener('click', handleExpertDiff);
      battleRoyaleButton.removeEventListener('click', handleBattleRoyale);
      hideAndSeekButton.removeEventListener('click', handleHideAndSeek);
      gameModeForm.removeEventListener('submit', handleSubmit);
    }
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
        playSoloGame(roundDuration, 1, 0);
        break;
      case 'hard-solo':
        roundDuration = 60;
        playSoloGame(roundDuration, 1, 0);
        break;
      case 'expert-solo':
        roundDuration = 30;
        playSoloGame(roundDuration, 1, 0);
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
    // Remove the event listeners to avoid multiple copies of the same listeners
    removeEventListeners();
  }

  // Add the event listeners to the buttons
  normalDiffButton.addEventListener('click', handleNormalDiff);
  hardDiffButton.addEventListener('click', handleHardDiff);
  expertDiffButton.addEventListener('click', handleExpertDiff);
  battleRoyaleButton.addEventListener('click', handleBattleRoyale);
  hideAndSeekButton.addEventListener('click', handleHideAndSeek);

  // Add submit event listener for gamemode selection form
  gameModeForm.addEventListener('submit', handleSubmit);
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
