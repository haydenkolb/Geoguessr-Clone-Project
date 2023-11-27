import { AuthController } from "./AuthMVC/AuthControler";
import { AuthView } from "./AuthMVC/AuthView";
import { GameModeSelectionControler } from "./GameModeSelectionMVC/GameModeSelectionControler";
import { GameModeSelectionView } from "./GameModeSelectionMVC/GameModeSelectionView";
import { InSoloGameModel } from "./InSoloGameMVC/InSoloGameModel";
import { InSoloGameView } from "./InSoloGameMVC/InSoloGameView";
import { InSoloGameControler } from "./InSoloGameMVC/InSoloGameControler";

class OverloardControler {
    constructor(variablesObj) {
        this.currentModel = null;
        this.currentControler = null;
        this.currentView = null;

        // for holding variables that MVC's need
        this.variablesObj = variablesObj;

        this.setAuthMVC();
    }

    setAuthMVC = () => {
        console.log('MVC: Auth');
        this.currentModel = null;
        this.currentView = new AuthView();
        this.currentControler = new AuthController(this.currentView, this.variablesObj.app, this.setGameModeSelectionMVC);
    }

    setGameModeSelectionMVC = () => {
        console.log('MVC: Game Mode Selection');
        this.currentModel = null;
        this.currentView = new GameModeSelectionView();
        this.currentControler = new GameModeSelectionControler(this.currentView, this.setInSoloGameMVC);
    }

    setInSoloGameMVC = (rounds,roundDuration) => {
        console.log('MVC: Solo Game');
        this.currentView = new InSoloGameView();
        this.currentModel = new InSoloGameModel(rounds,roundDuration);
        this.currentControler = new InSoloGameControler(
            this.currentView,
            this.currentModel,
            this.variablesObj.guessCoordinatesObj,
            this.variablesObj.setLocationMarker,
            this.variablesObj.panToLocationMarker,
            this.variablesObj.getRandomLocation,
            this.variablesObj.processSVData,
            this.variablesObj.clearLocationMarkers
            );
    }
}

export {OverloardControler}