import { initializeApp } from 'firebase/app';
import { OverloardControler } from './OverloardControler';

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

// Declaration of street view service, map, panorama, and guessMarker variables.
let sv;
let map;
let panorama;
let guessMarker;
let locationMarker;

// guess location of user
const guessCoordinatesObj = {'lat':null, 'lon':null};

// Places a marker on the guessing map when clicked
function placeGuessMarker(latLng) {
  const guessButton = document.getElementById('guess-button')
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
  guessCoordinatesObj.lat = latLng.lat();
  guessCoordinatesObj.lon = latLng.lng();
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

function setLocationMarker(LatLng) {
  locationMarker = new google.maps.Marker({
    position: LatLng,
    map,
  });
}

// TODO: change name  to panToMarker
function panToLocationMarker() {
  map.panTo(locationMarker.position);
}

function clearLocationMarkers() {
  locationMarker.setMap(null);
  locationMarker = undefined;
  if (guessMarker !== undefined) {
    guessMarker.setMap(null);
    guessMarker = undefined;
  }
}

const variablesObj = {
  'app':app,
  'guessCoordinatesObj':guessCoordinatesObj,
  'setLocationMarker':setLocationMarker,
  'panToLocationMarker':panToLocationMarker,
  'getRandomLocation':getRandomLocation,
  'processSVData':processSVData,
  'clearLocationMarkers':clearLocationMarkers
};

const overloardControler = new OverloardControler(variablesObj);