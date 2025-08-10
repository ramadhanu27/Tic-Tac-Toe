declare class GameManager {
    private guessNumberGame;
    private ticTacToeGame;
    private memoryCardGame;
    private game2048;
    private tetrisGame;
    constructor();
    private initializeEventListeners;
    private showGameSelector;
    private showGuessNumberGame;
    private showTicTacToeGame;
    private showMemoryCardGame;
    private show2048Game;
    private showTetrisGame;
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
type BoardSize = 3 | 4 | 5;
type TournamentMode = "single" | "best3" | "best5" | "best7";
interface GameStatistics {
    gamesPlayed: number;
    player1Wins: number;
    player2Wins: number;
    draws: number;
}
interface TournamentState {
    mode: TournamentMode;
    currentGame: number;
    totalGames: number;
    player1Score: number;
    player2Score: number;
    isActive: boolean;
}
type MemoryDifficulty = 4 | 6 | 8;
type MemoryTheme = "numbers" | "colors" | "symbols" | "emojis";
type MemoryMode = "relaxed" | "speed";
interface MemoryCard {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
    element?: HTMLElement;
}
interface MemoryGameState {
    cards: MemoryCard[];
    flippedCards: MemoryCard[];
    moves: number;
    matches: number;
    totalPairs: number;
    startTime: number;
    endTime: number;
    isGameActive: boolean;
    difficulty: MemoryDifficulty;
    theme: MemoryTheme;
    mode: MemoryMode;
    timeLeft: number;
    timerInterval: number | null;
}
interface MemoryStatistics {
    gamesPlayed: number;
    gamesWon: number;
    bestTime: number;
    bestMoves: number;
    totalTime: number;
    totalMoves: number;
}
type GridSize = 3 | 4 | 5 | 6;
type GameMode2048 = "manual" | "ai" | "assist";
type Direction = "up" | "down" | "left" | "right";
interface Tile2048 {
    value: number;
    row: number;
    col: number;
    id: number;
    isNew: boolean;
    isMerged: boolean;
    element?: HTMLElement;
}
interface GameState2048 {
    grid: (Tile2048 | null)[][];
    score: number;
    bestScore: number;
    moves: number;
    gridSize: GridSize;
    gameMode: GameMode2048;
    isGameOver: boolean;
    hasWon: boolean;
    canUndo: boolean;
    previousState?: {
        grid: (Tile2048 | null)[][];
        score: number;
        moves: number;
    };
    aiInterval?: number;
    aiSpeed: number;
    nextTileId: number;
}
interface Achievement2048 {
    value: number;
    unlocked: boolean;
    dateUnlocked?: Date;
}
interface Statistics2048 {
    gamesPlayed: number;
    gamesWon: number;
    bestScore: number;
    totalScore: number;
    totalMoves: number;
    achievements: Achievement2048[];
    highestTile: number;
}
type TetrisPieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type TetrisTheme = "classic" | "neon" | "retro" | "minimal";
type TetrisGameMode = "manual" | "ai" | "assist";
interface TetrisPiece {
    type: TetrisPieceType;
    shape: number[][];
    x: number;
    y: number;
    rotation: number;
}
interface TetrisGameState {
    board: (TetrisPieceType | null)[][];
    currentPiece: TetrisPiece | null;
    nextPiece: TetrisPiece | null;
    heldPiece: TetrisPiece | null;
    canHold: boolean;
    score: number;
    level: number;
    lines: number;
    gameMode: TetrisGameMode;
    theme: TetrisTheme;
    isGameOver: boolean;
    isPaused: boolean;
    dropInterval: number;
    lastDrop: number;
    aiInterval?: number;
    aiSpeed: number;
}
interface TetrisStatistics {
    gamesPlayed: number;
    bestScore: number;
    totalLines: number;
    totalScore: number;
    lineClearStats: {
        single: number;
        double: number;
        triple: number;
        tetris: number;
    };
    averageLevel: number;
}
declare class TicTacToeGame {
    private board;
    private currentPlayer;
    private gameEnded;
    private scores;
    private gameMode;
    private botDifficulty;
    private isPlayerTurn;
    private boardSize;
    private player1Symbol;
    private player2Symbol;
    private statistics;
    private tournament;
    private timerEnabled;
    private timeLeft;
    private timerInterval;
    constructor();
    private initializeBoard;
    private initializeUI;
    private initializeEventListeners;
    startNewGame(): void;
    private setGameMode;
    private setBotDifficulty;
    private setBoardSize;
    private setTournamentMode;
    private setPlayer1Symbol;
    private setPlayer2Symbol;
    private toggleTimer;
    private makeMove;
    private makeBotMove;
    private getBotMove;
    private getRandomMove;
    private getBestMove;
    private minimax;
    private checkWinnerForBoard;
    private checkWinner;
    private generateWinPatterns;
    private handleGameEnd;
    private endTournament;
    private endGame;
    private updateBoard;
    private updateDisplay;
    private updateScoreDisplay;
    private showResult;
    private clearResult;
    private resetScores;
    private loadScores;
    private startTimer;
    private stopTimer;
    private updateTimerDisplay;
    private handleTimeOut;
    private createBoardElements;
    private updateGameModeDisplay;
    private updateBoardSizeDisplay;
    private updateTournamentDisplay;
    private updateStatisticsDisplay;
    private loadStatistics;
    private saveStatistics;
    private resetStatistics;
    private saveScores;
}
declare class MemoryCardGame {
    private gameState;
    private statistics;
    private themes;
    constructor();
    private initializeThemes;
    private initializeGameState;
    private initializeEventListeners;
    private initializeUI;
    startNewGame(): void;
    private setDifficulty;
    private setTheme;
    private setMode;
    private generateCards;
    private shuffleArray;
    private createBoard;
    private flipCard;
    private checkMatch;
    private updateCardDisplay;
    private startTimer;
    private stopTimer;
    private updateTimerDisplay;
    private endGame;
    private updateGameInfo;
    private updateStatisticsDisplay;
    private showResult;
    private clearResult;
    private loadStatistics;
    private saveStatistics;
    private resetStatistics;
}
declare class Game2048 {
    private gameState;
    private statistics;
    constructor();
    private initializeGameState;
    private initializeEventListeners;
    private initializeUI;
    startNewGame(): void;
    private setGridSize;
    private setGameMode;
    private initializeGrid;
    private addRandomTile;
    private createBoard;
    private updateTileElement;
    private handleKeyPress;
    private makeMove;
    private moveTiles;
    private moveRowLeft;
    private moveRowRight;
    private moveColumnUp;
    private moveColumnDown;
    private aiStep;
    private aiAutoPlay;
    private aiStop;
    private getBestMove;
    private evaluateMove;
    private cloneGrid;
    private getEmptyCellCount;
    private getMonotonicity;
    private getSmoothness;
    private saveCurrentState;
    private undoMove;
    private checkGameState;
    private canMove;
    private checkAchievements;
    private unlockAchievement;
    private getHighestTile;
    private updateDisplay;
    private updateGameInfo;
    private updateBoard;
    private updateAchievements;
    private updateAIButtonStates;
    private updateAISpeedDisplay;
    private showResult;
    private clearResult;
    private loadStatistics;
    private saveStatistics;
    private updateStatistics;
    private updateStatisticsDisplay;
    private resetStatistics;
}
declare class TetrisGame {
    private gameState;
    private statistics;
    private gameLoop?;
    private readonly BOARD_WIDTH;
    private readonly BOARD_HEIGHT;
    private readonly PIECES;
    constructor();
    private initializeGameState;
    private initializeEventListeners;
    private initializeUI;
    startNewGame(): void;
    private setGameMode;
    private setTheme;
    private togglePause;
    private generateRandomPiece;
    private spawnNewPiece;
    private holdPiece;
    private handleKeyPress;
    private movePiece;
    private rotatePiece;
    private hardDrop;
    private isValidPosition;
    private placePiece;
    private clearLines;
    private aiStep;
    private aiAutoPlay;
    private aiStop;
    private getBestMove;
    private evaluatePosition;
    private countCompleteLines;
    private countHoles;
    private calculateBumpiness;
    private calculateHeight;
    private executeBestMove;
    private startGameLoop;
    private stopGameLoop;
    private update;
    private updateDropInterval;
    private createBoard;
    private updateBoard;
    private updateNextPieceDisplay;
    private updateHoldPieceDisplay;
    private updateDisplay;
    private updateLineClearStats;
    private showTetrisAchievement;
    private showLevelUp;
    private animateLineClear;
    private gameOver;
    private updateSpeedDisplay;
    private updateAISpeedDisplay;
    private updateAIButtonStates;
    private showResult;
    private clearResult;
    private loadStatistics;
    private saveStatistics;
    private updateStatisticsDisplay;
    private resetStatistics;
}
//# sourceMappingURL=main.d.ts.map