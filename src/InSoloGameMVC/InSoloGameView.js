class InSoloGameView {
    constructor() {
        this.guessButton = document.getElementById('guess-button');
        this.scoreOverlay = document.getElementById('score-overlay');
        this.timer = document.getElementById('timer');
        this.timeRemaining = document.getElementById('time-remaining');

        this.roundScoreP = document.getElementById('round-score');
        this.distanceP = document.getElementById('distance');
        this.gameContainer = document.getElementById('game-container');
        this.originalMap = document.getElementById('map');
        this.mapDiv = document.getElementById('map');
        this.panoramaDiv = document.getElementById('pano');

        this.handlerGuessButton = null;

        this.initialPositionOfMap = {
            position: this.originalMap.style.position,
            top: this.originalMap.style.top,
            left: this.originalMap.style.left,
            transform: this.originalMap.style.transform,
            bottom: this.originalMap.style.bottom,
            right: this.originalMap.style.right,
        };

        this.isGuessButtonUnbinded = true;
    }

    displayInRound = () => {
        this.mapDiv.style.display = 'block';
        this.panoramaDiv.style.display = 'flex';
        this.timer.style.display = 'block';
    }

    displayEndOfRound = (roundScore,scoreAccumulated) => {
        this.timer.style.display = 'none';
        this.guessButton.style.display = 'none';
        this.scoreOverlay.style.display = 'block';
        // for time runs out!!!! 
        // roundScoreP.innerHTML = 'Guessing time ran out!';
        this.roundScoreP.innerHTML = `Score for this round is <span style="color:purple">${roundScore}</span><br>Your overall score is <span style="color:purple">${scoreAccumulated}</span>`;
        this.scoreOverlay.appendChild(this.originalMap);
        this.originalMap.style.position = 'absolute';
        this.originalMap.style.top = '60%';
        this.originalMap.style.left = '50%';
        this.originalMap.style.transform = 'translate(-50%, -50%)';
    }
    
    hideEndOfRound = () => {
        this.scoreOverlay.style.display = 'none';
        this.timer.style.display = 'block';
    }

    displayGameOver = (scoreAccumulated) => {
        this.timer.style.display = 'none';
        this.guessButton.style.display = 'none';
        this.scoreOverlay.style.display = 'block';
        this.mapDiv.style.display = 'none';
        this.distanceP.innerHTML = '';
        this.roundScoreP.innerHTML = `Game over.<br>Your score for this game is <span style="color:purple">${scoreAccumulated}</span>`;
    };

    appendOriginalMapToGameContainer = () => {
        this.gameContainer.appendChild(this.originalMap);
    }

    moveMapToBottomRight = () => {
        this.originalMap.style.position = this.initialPositionOfMap.position;
        this.originalMap.style.top = this.initialPositionOfMap.top;
        this.originalMap.style.left = this.initialPositionOfMap.left;
        this.originalMap.style.transform = this.initialPositionOfMap.transform;
        this.originalMap.style.bottom = this.initialPositionOfMap.bottom;
        this.originalMap.style.right = this.initialPositionOfMap.right;
    };

    bindGuessButton = (handler) => {
        this.handlerGuessButton = handler;
        this.guessButton.addEventListener('click', this.handlerGuessButtonWrapper);
        this.isGuessButtonUnbinded = false;
    }

    unbindGuessButton = () => {
        if (!this.isGuessButtonUnbinded) {
            this.guessButton.removeEventListener('click', this.handlerGuessButtonWrapper);
        }
    }

    handlerGuessButtonWrapper = () => {
        if (!this.isGuessButtonUnbinded) {
            this.guessButton.removeEventListener('click', this.handlerGuessButtonWrapper);
        }
        this.handlerGuessButton();
    }
    
    displayDistanceMessage = (distance) => {
        // TODO: eventually move rounding to controller
        console.log(`displayDistanceMssg: distance = ${distance}`)
        this.distanceP.innerHTML = `Guess was <span style="color:purple">${Math.round(distance)}</span> km away from the location`;
    }

    clearDistanceMessage = () => {
        this.distanceP.innerHTML = '';
    }

    updateTimeRemaining = (minutes, seconds) => {
        this.timeRemaining.innerHTML = `${minutes}:${seconds}`;
    }
}

export {InSoloGameView}