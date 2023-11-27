class InSoloGameModel {
    constructor(rounds,roundDuration) {
        this.rounds = rounds;
        this.roundDurationMS = roundDuration * 1000;
        this.currentRound = 0;
        this.roundScore = 0;
        this.scoreAccumulated = 0;
        this.location = {
            'lat': null,
            'lon': null
        }
        this.guessedLocation = {
            'lat': null,
            'lon': null
        }
        this.roundDistance = null;
        this.hasGuessed = false;
        this.roundTimer = null;

        this.MAX_DISTANCE = 5000;
        this.MAX_ROUND_SCORE = 5000;

        this.roundTickIntervalID = null;

        this.handlerRoundOver = null;
        this.handlerTickInRound = null;
        this.handlerTickPreRound = null;
    }

    bindRoundOver = (handler) => {
        this.handlerRoundOver = handler;
    }

    bindTickInRound = (handler) => {
        this.handlerTickInRound = handler;
    }

    bindTickPreRound = (handler) => {
        // TODO: decide if this is method is needed, remove if not
        this.handlerTickPreRound = handler;
    }
    

    calculateScores = () => {
        const decimalRoundScore = this.MAX_ROUND_SCORE * (1 - this.roundDistance / this.MAX_DISTANCE);
        console.log(`calculateScores: decimalRoundScore = ${decimalRoundScore}, Math.max(...) = ${Math.max(0, Math.round(decimalRoundScore))}`)
        this.roundScore = Math.max(0, Math.round(decimalRoundScore));
        this.scoreAccumulated += this.roundScore;

        console.log(`calculateScores: score = ${this.roundScore}, scoreAcc = ${this.scoreAccumulated}`);
        return {'roundScore': this.roundScore, 'scoreAccumulated': this.scoreAccumulated};
    }
  
    // Starts round at startTime
    // lat and lon is coordinates for location that user will try to guess for in this round
    setUpRound = (lat,lon,startTime) => {
        this.roundTimer = new Timer(startTime, this.roundDurationMS);
        this.location.lat = lat;
        this.location.lon = lon;
        this.guessedLocation.lat = null;
        this.guessedLocation.lon = null;
        this.currentRound += 1;
        this.roundScore = null;
        this.roundDistance = null;
        this.hasGuessed = false;

        console.log(`setUpRound: currentRound = ${this.currentRound}`)
        this.tick();
    }

    makeGuess = (lat,lon) => {
        console.log('this in makeGuess():',this);
        if (this.hasGuessed) {
            throw new Error("Already guessed this round!");
        }
        if (this.isRoundTimeOver()) {
            throw new Error("Can't guess, round is over!");
        }
        clearInterval(this.roundTickIntervalID);

        this.guessedLocation.lat = lat;
        this.guessedLocation.lon = lon;
        this.hasGuessed = true;
        this.roundOver()
    }

    // tick means 1 second passes (like a clock tick)
    tick = () => {
        const ONE_SECOND_IN_MS = 1000;
        this.roundTickIntervalID = setInterval(() => {
            if (this.roundTimer.hasStarted()) {
                console.log(`Tick: ${this.roundTimer.timeLeft()/1000} seconds`)
                this.handlerTickInRound(this.roundTimer.timeLeft());
                console.log(`tick: isRoundTimeOver = ${this.isRoundTimeOver()}`)
                if (this.isRoundTimeOver()) {
                    console.log('tick: clear interval & call roundOver')
                    clearInterval(this.roundTickIntervalID);
                    this.roundOver();
                }
            } else {
                // TODO: remove this or figure out what to do with it
                // this.handlerTickPreRound(this.roundTimer.timeTillStart());
            }
        }, ONE_SECOND_IN_MS);
    }

    roundOver = () => {
        this.calculateGuessDistance();
        this.calculateScores();

        const roundObj = {
            roundDistance: this.roundDistance,
            roundScore: this.roundScore,
            scoreAccumulated:this.scoreAccumulated
        };
        console.log(`roundOver: roundObj = ${roundObj}`);
        this.handlerRoundOver(roundObj);
    }

    isRoundTimeOver = () => {
        return this.roundTimer.timeLeft() === 0;
    }

    isGameOver = () => {
        console.log(`isGameOver: ${this.currentRound === this.rounds}, currentRound = ${this.currentRound}`);
        return this.currentRound === this.rounds;
    }


    calculateGuessDistance = () => {
        let roundDistance;
        if (this.hasGuessed) {
            roundDistance = this.haversineDistance(this.location.lat, this.location.lon, this.guessedLocation.lat, this.guessedLocation.lon);
        } else {
            roundDistance = this.MAX_DISTANCE;
        }
        this.roundDistance = roundDistance;
        console.log(`CalculateGuessDistance: distance = ${this.roundDistance}`);
        return this.roundDistance;
    }

    // Haversine distance function returns the distance of the guess to the actual location
    haversineDistance(lat1, lon1, lat2, lon2) {
        // Helper function for haversine distance
        function toRadians(angle) {
            return angle * (Math.PI / 180);
        }

        const R = 6371; // Earth's radius in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1))
        * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }


}

class Timer {
    constructor(startTimeMS, durationMS) {
        // startTime is miliseconds since epoch
        // duration is in miliseconds
        this.startTimeMS = startTimeMS;
        this.endTimeMS = startTimeMS + durationMS;
    }

    hasStarted = () => {
        return this.startTimeMS <= Date.now(); 
    }

    timeTillStart = () => {
        return this.startTimeMS - Date.now();
    }

    timeLeft = () => {
        const timeLeftCalculation = this.endTimeMS - Date.now();
        return timeLeftCalculation >= 0 ? timeLeftCalculation : 0;
    }
}

export {InSoloGameModel}