class GameModeSelectionControler {
    constructor(gameModeSelectionView, soloGameMVCCallback) {
        this.gameModeSelectionView = gameModeSelectionView;
        this.soloGameMVCCallback = soloGameMVCCallback;
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

        // TODO: figure out better place for this const
        const MAX_ROUNDS_PER_SOLO_GAME = 5;

        // Determine round duration for the solo game mode & handle case for multiplayer modes selection
        switch (gameMode) {
            case 'normal-solo':
                this.soloGameMVCCallback(MAX_ROUNDS_PER_SOLO_GAME, this.roundDuration['normal-solo'])
                break;
            case 'hard-solo':
                this.soloGameMVCCallback(MAX_ROUNDS_PER_SOLO_GAME, this.roundDuration['hard-solo'])
                break;
            case 'expert-solo':
                this.soloGameMVCCallback(MAX_ROUNDS_PER_SOLO_GAME, this.roundDuration['expert-solo'])
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