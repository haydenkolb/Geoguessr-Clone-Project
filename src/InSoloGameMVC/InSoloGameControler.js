class InSoloGameControler {
    constructor(inSoloGameView, inSoloGameModel, guessCoordinatesObj, setLocationMarker, panToLocationMarker, getRandomLocation, processSVData, clearLocationMarkers) {
        this.model = inSoloGameModel;
        this.view = inSoloGameView;

        this.guessCoordinatesObj = guessCoordinatesObj;

        this.setLocationMarker = setLocationMarker;
        this.panToLocationMarker = panToLocationMarker;
        this.getRandomLocation = getRandomLocation;
        this.processSVData = processSVData;
        this.clearLocationMarkers = clearLocationMarkers;

        // A google maps LatLng class object
        // Used for placing a marker close (not exact) to actual location on map
        this.locationLatLng = null;
        // Contains the exact coordinates of actual guess location
        // Used for calculating distance between actual location and guessed location
        this.locationData = null;

        this.view.bindGuessButton(this.handleGuess);
        this.model.bindRoundOver(this.handleRoundOver);
        this.model.bindTickInRound(this.handleTickInRound);

        this.view.displayInRound();
        this.startRound();
    }


    handleGuess = async () => {
        // TODO: check if calling unbindGB to many times causes problems
        this.view.unbindGuessButton();
        this.model.makeGuess(this.guessCoordinatesObj.lat, this.guessCoordinatesObj.lon);
    }

    handleRoundOver = (roundObj) => {
        // TODO: handle no guess made, and remove roundObj and just use roundDistance, roundScore, scoreAcc
        this.view.unbindGuessButton();
        this.guessCoordinatesObj.lat = null;
        this.guessCoordinatesObj.lon = null;
        this.view.displayEndOfRound(roundObj.roundScore, roundObj.scoreAccumulated);
        this.view.displayDistanceMessage(roundObj.roundDistance);
        this.setLocationMarker(this.locationLatLng);
        this.panToLocationMarker()

        this.intermission()
    }

    resetPage = () => {
        this.view.hideEndOfRound();
        this.view.appendOriginalMapToGameContainer();
        this.view.moveMapToBottomRight();
    }

    intermission = () => {
        setTimeout(async () => {
            this.resetPage();
            this.clearLocationMarkers();
            
            console.log(`intermission: isGameOver = ${this.model.isGameOver()}`)
            if (this.model.isGameOver()) {
                this.view.displayGameOver(this.model.scoreAccumulated);
            } else {
                this.startRound();
            }
        }, 5000)
    }

    handleTickInRound = (timeLeftMS) => {
        const timeLeftSeconds = timeLeftMS/1000;
        const minutes = parseInt(timeLeftSeconds / 60, 10);
        const seconds = parseInt(timeLeftSeconds % 60, 10);
    
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this.view.updateTimeRemaining(minutesStr, secondsStr);
    }

    startRound = async () => {
        // sends random loc to this.guessCoordObj
        this.locationLatLng = await this.getRandomLocation();
        this.locationData = await this.processSVData(this.locationLatLng,100);
        this.view.displayInRound();
        this.view.bindGuessButton(this.handleGuess);
        this.model.setUpRound(this.locationData.newLat, this.locationData.newLng, Date.now());
    } 

} 

export {InSoloGameControler}