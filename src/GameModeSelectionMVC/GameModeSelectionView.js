class GameModeSelectionView {
    constructor() {
        // Game mode selection form gameModeTypeInput holds value of submitted game type
        this.gameModeTypeInput = document.getElementById('mode-type');
        this.gameModeForm = document.getElementById('game-mode-form');

        // Event listeners for game mode selection buttons
        document.getElementById('normal-diff').addEventListener('click', () => {
            this.gameModeTypeInput.value = 'normal-solo';
        });
        document.getElementById('hard-diff').addEventListener('click', () => {
            this.gameModeTypeInput.value = 'hard-solo';
        });
        document.getElementById('expert-diff').addEventListener('click', () => {
            this.gameModeTypeInput.value = 'expert-solo';
        });
        document.getElementById('battle-royale').addEventListener('click', () => {
            this.gameModeTypeInput.value = 'battle-royale';
        });
        document.getElementById('hide-and-seek').addEventListener('click', () => {
            this.gameModeTypeInput.value = 'hide-and-seek';
        });
    }

    bindGameModeForm = (handler)  => {
        this.gameModeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handler(this.gameModeTypeInput.value);
        })
    }
    
    hideGameModeForm = () => {
        this.gameModeForm.style.display = 'none';
    }

    displayGameModeForm = () => {
        this.gameModeForm.style.display = 'block';
    }

}

export {GameModeSelectionView}