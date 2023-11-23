class GameModeSelectionControler {
    constructor(gameModeSelectionView, soloGameCallback) {
        this.gameModeSelectionView = gameModeSelectionView;
        this.soloGameCallback = soloGameCallback;
        this.roundDuration = {
            'normal-solo': 120,
            'hard-solo': 60,
            'expert-solo': 30
        }

        this.gameModeSelectionView.displayGameModeForm()
        this.gameModeSelectionView.bindGameModeForm(this.handleGameModeSelection)
    }

    handleGameModeSelection = (gameMode) => {
        this.gameModeSelectionView.hideGameModeForm();

        // Determine round duration for the solo game mode & handle case for multiplayer modes selection
        switch (gameMode) {
            case 'normal-solo':
                this.soloGameCallback(this.roundDuration['normal-solo'],1,0)
                break;
            case 'hard-solo':
                this.soloGameCallback(this.roundDuration['hard-solo'],1,0)
                break;
            case 'expert-solo':
                this.soloGameCallback(this.roundDuration['expert-solo'],1,0)
                break;
            case 'battle-royale':
                // TODO: Display the lobby selection page & host lobby button
                break;
            case 'hide-and-seek':
                // TODO: Display the lobby selection page & host lobby button
                break;
            default:
                break;
        }
    }
}

export {GameModeSelectionControler}