declare class GameManager {
    private guessNumberGame;
    private ticTacToeGame;
    constructor();
    private initializeEventListeners;
    private showGameSelector;
    private showGuessNumberGame;
    private showTicTacToeGame;
    private hideAllGames;
}
declare class GuessNumberGame {
    private targetNumber;
    private attempts;
    private bestScore;
    private gameEnded;
    private minRange;
    private maxRange;
    private showingRange;
    private autoSolving;
    constructor();
    private initializeEventListeners;
    startNewGame(): void;
    private makeGuess;
    private endGame;
    private updateDisplay;
    private showResult;
    private clearResult;
    private showNewGameButton;
    private updateBestScore;
    private loadBestScore;
    private saveBestScore;
    private getHint;
    private autoSolve;
    private binarySearchSolve;
    private toggleRange;
    private updateRange;
    private showHint;
    private clearHint;
    private toggleBotButtons;
}
type BotDifficulty = "easy" | "medium" | "hard";
type GameMode = "pvp" | "pvb";
declare class TicTacToeGame {
    private board;
    private currentPlayer;
    private gameEnded;
    private scores;
    private gameMode;
    private botDifficulty;
    private isPlayerTurn;
    constructor();
    private initializeUI;
    private initializeEventListeners;
    startNewGame(): void;
    private setGameMode;
    private setBotDifficulty;
    private makeMove;
    private makeBotMove;
    private getBotMove;
    private getRandomMove;
    private getBestMove;
    private minimax;
    private checkWinnerForBoard;
    private checkWinner;
    private endGame;
    private updateBoard;
    private updateDisplay;
    private updateScoreDisplay;
    private showResult;
    private clearResult;
    private resetScores;
    private loadScores;
    private saveScores;
}
//# sourceMappingURL=main.d.ts.map