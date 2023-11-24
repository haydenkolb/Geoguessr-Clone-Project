import { AuthController } from "./AuthMVC/AuthControler";
import { AuthView } from "./AuthMVC/AuthView";
import { GameModeSelectionControler } from "./GameModeSelectionMVC/GameModeSelectionControler";
import { GameModeSelectionView } from "./GameModeSelectionMVC/GameModeSelectionView";

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
        this.currentModel = null;
        this.currentView = new AuthView();
        this.currentControler = new AuthController(this.currentView, this.variablesObj.app, this.setGameModeSelectionMVC);
    }

    setGameModeSelectionMVC = () => {
        this.currentModel = null;
        this.currentView = new GameModeSelectionView();
        // call back is temperory, till in game MVC is created
        this.currentControler = new GameModeSelectionControler(this.currentView, this.variablesObj.soloGameCallback);
    }

    setInSoloGameMVC = () => {
        // TODO:
    }
}

export {OverloardControler}