"use strict";
// Game Manager Class
class GameManager {
    constructor() {
        this.guessNumberGame = new GuessNumberGame();
        this.ticTacToeGame = new TicTacToeGame();
        this.memoryCardGame = new MemoryCardGame();
        this.game2048 = new Game2048();
        this.tetrisGame = new TetrisGame();
        this.initializeEventListeners();
        this.showGameSelector();
    }
    initializeEventListeners() {
        // Game selector buttons
        document.getElementById("guessNumberBtn")?.addEventListener("click", () => {
            this.showGuessNumberGame();
        });
        document.getElementById("ticTacToeBtn")?.addEventListener("click", () => {
            this.showTicTacToeGame();
        });
        document.getElementById("memoryCardBtn")?.addEventListener("click", () => {
            this.showMemoryCardGame();
        });
        document.getElementById("game2048Btn")?.addEventListener("click", () => {
            this.show2048Game();
        });
        document.getElementById("tetrisBtn")?.addEventListener("click", () => {
            this.showTetrisGame();
        });
        // Back buttons
        document.getElementById("backFromGuess")?.addEventListener("click", () => {
            this.showGameSelector();
        });
        document.getElementById("backFromTicTacToe")?.addEventListener("click", () => {
            this.showGameSelector();
        });
        document.getElementById("backFromMemory")?.addEventListener("click", () => {
            this.showGameSelector();
        });
        document.getElementById("backFrom2048")?.addEventListener("click", () => {
            this.showGameSelector();
        });
        document.getElementById("backFromTetris")?.addEventListener("click", () => {
            this.showGameSelector();
        });
    }
    showGameSelector() {
        this.hideAllGames();
        document.querySelector(".game-selector")?.classList.remove("hidden");
    }
    showGuessNumberGame() {
        this.hideAllGames();
        document.getElementById("guessNumberGame")?.classList.remove("hidden");
        this.guessNumberGame.startNewGame();
    }
    showTicTacToeGame() {
        this.hideAllGames();
        document.getElementById("ticTacToeGame")?.classList.remove("hidden");
        this.ticTacToeGame.startNewGame();
    }
    showMemoryCardGame() {
        this.hideAllGames();
        document.getElementById("memoryCardGame")?.classList.remove("hidden");
        this.memoryCardGame.startNewGame();
    }
    show2048Game() {
        this.hideAllGames();
        document.getElementById("game2048")?.classList.remove("hidden");
        this.game2048.startNewGame();
    }
    showTetrisGame() {
        this.hideAllGames();
        document.getElementById("tetrisGame")?.classList.remove("hidden");
        this.tetrisGame.startNewGame();
    }
    hideAllGames() {
        document.querySelector(".game-selector")?.classList.add("hidden");
        document.getElementById("guessNumberGame")?.classList.add("hidden");
        document.getElementById("ticTacToeGame")?.classList.add("hidden");
        document.getElementById("memoryCardGame")?.classList.add("hidden");
        document.getElementById("game2048")?.classList.add("hidden");
        document.getElementById("tetrisGame")?.classList.add("hidden");
    }
}
// Guess Number Game Class
class GuessNumberGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.bestScore = 0;
        this.gameEnded = false;
        this.minRange = 1;
        this.maxRange = 100;
        this.showingRange = false;
        this.autoSolving = false;
        this.loadBestScore();
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        document.getElementById("submitGuess")?.addEventListener("click", () => {
            this.makeGuess();
        });
        document.getElementById("guessInput")?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.makeGuess();
            }
        });
        document.getElementById("newGameGuess")?.addEventListener("click", () => {
            this.startNewGame();
        });
        // Bot helper buttons
        document.getElementById("getHint")?.addEventListener("click", () => {
            this.getHint();
        });
        document.getElementById("autoSolve")?.addEventListener("click", () => {
            this.autoSolve();
        });
        document.getElementById("showRange")?.addEventListener("click", () => {
            this.toggleRange();
        });
    }
    startNewGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameEnded = false;
        this.minRange = 1;
        this.maxRange = 100;
        this.autoSolving = false;
        this.updateDisplay();
        this.clearResult();
        this.clearHint();
        this.showNewGameButton(false);
        this.updateRange();
        const input = document.getElementById("guessInput");
        if (input) {
            input.value = "";
            input.disabled = false;
            input.classList.remove("auto-solving");
        }
        // Enable bot helper buttons
        this.toggleBotButtons(false);
    }
    makeGuess() {
        if (this.gameEnded)
            return;
        const input = document.getElementById("guessInput");
        const guess = parseInt(input.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showResult("Masukkan angka yang valid antara 1-100!", "error");
            return;
        }
        this.attempts++;
        this.updateDisplay();
        if (guess === this.targetNumber) {
            this.showResult(`Selamat! Anda berhasil menebak angka ${this.targetNumber} dalam ${this.attempts} percobaan!`, "success");
            this.endGame();
            this.updateBestScore();
        }
        else if (guess < this.targetNumber) {
            this.showResult("Terlalu kecil! Coba angka yang lebih besar.", "info");
            this.minRange = Math.max(this.minRange, guess + 1);
        }
        else {
            this.showResult("Terlalu besar! Coba angka yang lebih kecil.", "info");
            this.maxRange = Math.min(this.maxRange, guess - 1);
        }
        this.updateRange();
        this.clearHint();
        input.value = "";
    }
    endGame() {
        this.gameEnded = true;
        const input = document.getElementById("guessInput");
        if (input)
            input.disabled = true;
        this.showNewGameButton(true);
    }
    updateDisplay() {
        const attemptsElement = document.getElementById("attempts");
        if (attemptsElement)
            attemptsElement.textContent = this.attempts.toString();
    }
    showResult(message, type) {
        const resultElement = document.getElementById("guessResult");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `result ${type}`;
        }
    }
    clearResult() {
        const resultElement = document.getElementById("guessResult");
        if (resultElement) {
            resultElement.textContent = "";
            resultElement.className = "result";
        }
    }
    showNewGameButton(show) {
        const button = document.getElementById("newGameGuess");
        if (button) {
            button.classList.toggle("hidden", !show);
        }
    }
    updateBestScore() {
        if (this.bestScore === 0 || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            this.saveBestScore();
            const bestScoreElement = document.getElementById("bestScore");
            if (bestScoreElement)
                bestScoreElement.textContent = this.bestScore.toString();
        }
    }
    loadBestScore() {
        const saved = localStorage.getItem("guessNumberBestScore");
        this.bestScore = saved ? parseInt(saved) : 0;
        const bestScoreElement = document.getElementById("bestScore");
        if (bestScoreElement) {
            bestScoreElement.textContent = this.bestScore > 0 ? this.bestScore.toString() : "-";
        }
    }
    saveBestScore() {
        localStorage.setItem("guessNumberBestScore", this.bestScore.toString());
    }
    // Bot Helper Methods
    getHint() {
        if (this.gameEnded)
            return;
        const mid = Math.floor((this.minRange + this.maxRange) / 2);
        const distance = Math.abs(this.targetNumber - mid);
        let hint = "";
        if (distance <= 5) {
            hint = `🔥 Sangat dekat! Coba sekitar ${mid}`;
        }
        else if (distance <= 15) {
            hint = `🌡️ Hangat! Range yang baik: ${this.minRange}-${this.maxRange}`;
        }
        else if (distance <= 30) {
            hint = `❄️ Dingin! Masih jauh dari target`;
        }
        else {
            hint = `🧊 Sangat dingin! Coba ubah strategi`;
        }
        this.showHint(hint);
    }
    autoSolve() {
        if (this.gameEnded || this.autoSolving)
            return;
        this.autoSolving = true;
        const input = document.getElementById("guessInput");
        if (input)
            input.classList.add("auto-solving");
        this.toggleBotButtons(true);
        this.showHint("🤖 Bot sedang menyelesaikan...");
        // Use binary search algorithm
        this.binarySearchSolve();
    }
    binarySearchSolve() {
        if (this.gameEnded)
            return;
        const guess = Math.floor((this.minRange + this.maxRange) / 2);
        const input = document.getElementById("guessInput");
        if (input) {
            input.value = guess.toString();
            setTimeout(() => {
                this.makeGuess();
                if (!this.gameEnded && this.autoSolving) {
                    setTimeout(() => this.binarySearchSolve(), 1500);
                }
                else {
                    this.autoSolving = false;
                    input.classList.remove("auto-solving");
                    this.toggleBotButtons(false);
                    this.clearHint();
                }
            }, 1000);
        }
    }
    toggleRange() {
        this.showingRange = !this.showingRange;
        this.updateRange();
        const button = document.getElementById("showRange");
        if (button) {
            button.textContent = this.showingRange ? "🙈 Sembunyikan Range" : "📊 Tampilkan Range";
        }
    }
    updateRange() {
        const rangeElement = document.getElementById("currentRange");
        if (rangeElement) {
            if (this.showingRange) {
                rangeElement.textContent = `Range: ${this.minRange} - ${this.maxRange}`;
                rangeElement.classList.remove("hidden");
            }
            else {
                rangeElement.classList.add("hidden");
            }
        }
    }
    showHint(message) {
        const hintElement = document.getElementById("hintResult");
        if (hintElement) {
            hintElement.textContent = message;
            hintElement.classList.remove("hidden");
        }
    }
    clearHint() {
        const hintElement = document.getElementById("hintResult");
        if (hintElement) {
            hintElement.textContent = "";
            hintElement.classList.add("hidden");
        }
    }
    toggleBotButtons(disabled) {
        const buttons = ["getHint", "autoSolve", "showRange"];
        buttons.forEach((id) => {
            const button = document.getElementById(id);
            if (button)
                button.disabled = disabled;
        });
    }
}
// Tic-Tac-Toe Game Class
class TicTacToeGame {
    constructor() {
        this.board = [];
        this.currentPlayer = "X";
        this.gameEnded = false;
        this.scores = { X: 0, O: 0, draw: 0 };
        this.gameMode = "pvp";
        this.botDifficulty = "medium";
        this.isPlayerTurn = true;
        this.boardSize = 3;
        this.player1Symbol = "X";
        this.player2Symbol = "O";
        this.statistics = {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
            draws: 0,
        };
        this.tournament = {
            mode: "single",
            currentGame: 1,
            totalGames: 1,
            player1Score: 0,
            player2Score: 0,
            isActive: false,
        };
        this.timerEnabled = false;
        this.timeLeft = 30;
        this.timerInterval = null;
        this.loadScores();
        this.loadStatistics();
        this.initializeBoard();
        this.initializeEventListeners();
        this.initializeUI();
    }
    initializeBoard() {
        this.board = new Array(this.boardSize * this.boardSize).fill("");
    }
    initializeUI() {
        // Set initial game mode UI
        document.querySelectorAll(".mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("pvpMode")?.classList.add("active");
        // Set initial board size UI
        document.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("size3")?.classList.add("active");
        // Set initial tournament mode UI
        document.querySelectorAll(".tournament-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("single")?.classList.add("active");
        // Set initial bot difficulty UI
        document.querySelectorAll(".difficulty-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("mediumBot")?.classList.add("active");
        // Hide bot difficulty initially (PvP mode)
        const botDifficultyDiv = document.getElementById("botDifficulty");
        if (botDifficultyDiv) {
            botDifficultyDiv.classList.add("hidden");
        }
        // Hide tournament status initially
        const tournamentStatusDiv = document.getElementById("tournamentStatus");
        if (tournamentStatusDiv) {
            tournamentStatusDiv.classList.add("hidden");
        }
        // Hide timer initially
        const timerDiv = document.getElementById("timer");
        if (timerDiv) {
            timerDiv.classList.add("hidden");
        }
        // Set initial displays
        this.updateGameModeDisplay();
        this.updateBoardSizeDisplay();
        this.updateStatisticsDisplay();
    }
    initializeEventListeners() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                this.makeMove(index);
            });
        });
        document.getElementById("newGameTicTacToe")?.addEventListener("click", () => {
            this.startNewGame();
        });
        document.getElementById("resetStats")?.addEventListener("click", () => {
            this.resetStatistics();
        });
        document.getElementById("toggleTimer")?.addEventListener("click", () => {
            this.toggleTimer();
        });
        // Game mode buttons
        document.getElementById("pvpMode")?.addEventListener("click", () => {
            this.setGameMode("pvp");
        });
        document.getElementById("pvbMode")?.addEventListener("click", () => {
            this.setGameMode("pvb");
        });
        // Board size buttons
        document.getElementById("size3")?.addEventListener("click", () => {
            this.setBoardSize(3);
        });
        document.getElementById("size4")?.addEventListener("click", () => {
            this.setBoardSize(4);
        });
        document.getElementById("size5")?.addEventListener("click", () => {
            this.setBoardSize(5);
        });
        // Tournament mode buttons
        document.getElementById("single")?.addEventListener("click", () => {
            this.setTournamentMode("single");
        });
        document.getElementById("best3")?.addEventListener("click", () => {
            this.setTournamentMode("best3");
        });
        document.getElementById("best5")?.addEventListener("click", () => {
            this.setTournamentMode("best5");
        });
        document.getElementById("best7")?.addEventListener("click", () => {
            this.setTournamentMode("best7");
        });
        // Symbol selection
        document.getElementById("player1Symbol")?.addEventListener("change", (e) => {
            this.setPlayer1Symbol(e.target.value);
        });
        document.getElementById("player2Symbol")?.addEventListener("change", (e) => {
            this.setPlayer2Symbol(e.target.value);
        });
        // Bot difficulty buttons
        document.getElementById("easyBot")?.addEventListener("click", () => {
            this.setBotDifficulty("easy");
        });
        document.getElementById("mediumBot")?.addEventListener("click", () => {
            this.setBotDifficulty("medium");
        });
        document.getElementById("hardBot")?.addEventListener("click", () => {
            this.setBotDifficulty("hard");
        });
    }
    startNewGame() {
        this.initializeBoard();
        this.currentPlayer = "X";
        this.gameEnded = false;
        this.isPlayerTurn = true;
        this.stopTimer();
        this.createBoardElements();
        this.updateDisplay();
        this.clearResult();
        this.updateBoard();
        if (this.timerEnabled) {
            this.startTimer();
        }
    }
    setGameMode(mode) {
        this.gameMode = mode;
        // Update UI
        document.querySelectorAll(".mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(mode === "pvp" ? "pvpMode" : "pvbMode")?.classList.add("active");
        // Show/hide bot difficulty
        const botDifficultyDiv = document.getElementById("botDifficulty");
        if (botDifficultyDiv) {
            botDifficultyDiv.classList.toggle("hidden", mode === "pvp");
        }
        // Update game mode display
        const gameModeElement = document.getElementById("gameMode");
        if (gameModeElement) {
            gameModeElement.textContent = `Mode: ${mode === "pvp" ? "Player vs Player" : "Player vs Bot"}`;
        }
        this.startNewGame();
    }
    setBotDifficulty(difficulty) {
        this.botDifficulty = difficulty;
        // Update UI
        document.querySelectorAll(".difficulty-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`${difficulty}Bot`)?.classList.add("active");
        this.startNewGame();
    }
    setBoardSize(size) {
        this.boardSize = size;
        this.initializeBoard();
        // Update UI
        document.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`size${size}`)?.classList.add("active");
        this.updateBoardSizeDisplay();
        this.createBoardElements();
        this.startNewGame();
    }
    setTournamentMode(mode) {
        this.tournament.mode = mode;
        // Calculate total games
        switch (mode) {
            case "single":
                this.tournament.totalGames = 1;
                this.tournament.isActive = false;
                break;
            case "best3":
                this.tournament.totalGames = 3;
                this.tournament.isActive = true;
                break;
            case "best5":
                this.tournament.totalGames = 5;
                this.tournament.isActive = true;
                break;
            case "best7":
                this.tournament.totalGames = 7;
                this.tournament.isActive = true;
                break;
        }
        // Reset tournament state
        this.tournament.currentGame = 1;
        this.tournament.player1Score = 0;
        this.tournament.player2Score = 0;
        // Update UI
        document.querySelectorAll(".tournament-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(mode)?.classList.add("active");
        this.updateTournamentDisplay();
        this.startNewGame();
    }
    setPlayer1Symbol(symbol) {
        this.player1Symbol = symbol;
        if (this.currentPlayer === "X") {
            this.updateBoard();
        }
    }
    setPlayer2Symbol(symbol) {
        this.player2Symbol = symbol;
        if (this.currentPlayer === "O") {
            this.updateBoard();
        }
    }
    toggleTimer() {
        this.timerEnabled = !this.timerEnabled;
        const timerDiv = document.getElementById("timer");
        const toggleBtn = document.getElementById("toggleTimer");
        if (timerDiv && toggleBtn) {
            timerDiv.classList.toggle("hidden", !this.timerEnabled);
            toggleBtn.textContent = this.timerEnabled ? "Disable Timer" : "Enable Timer";
        }
        if (this.timerEnabled && !this.gameEnded) {
            this.startTimer();
        }
        else {
            this.stopTimer();
        }
    }
    makeMove(index) {
        if (this.gameEnded || this.board[index] !== "")
            return;
        // In PvB mode, only allow player moves when it's player's turn
        if (this.gameMode === "pvb" && !this.isPlayerTurn)
            return;
        // Use custom symbols
        const symbol = this.currentPlayer === "X" ? this.player1Symbol : this.player2Symbol;
        this.board[index] = symbol;
        this.updateBoard();
        // Stop timer for current move
        this.stopTimer();
        if (this.checkWinner()) {
            const winner = this.gameMode === "pvb" && this.currentPlayer === "O" ? "Bot" : `Player ${this.currentPlayer}`;
            this.showResult(`${winner} menang!`, "success");
            this.handleGameEnd(this.currentPlayer);
        }
        else if (this.board.every((cell) => cell !== "")) {
            this.showResult("Permainan seri!", "info");
            this.handleGameEnd("draw");
        }
        else {
            this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
            this.isPlayerTurn = this.gameMode === "pvp" || this.currentPlayer === "X";
            this.updateDisplay();
            // Start timer for next player
            if (this.timerEnabled) {
                this.startTimer();
            }
            // If it's bot's turn, make bot move
            if (this.gameMode === "pvb" && !this.isPlayerTurn) {
                this.makeBotMove();
            }
        }
    }
    makeBotMove() {
        // Add visual indicator that bot is thinking
        const board = document.getElementById("ticTacToeBoard");
        if (board)
            board.classList.add("bot-thinking");
        // Delay bot move for better UX
        setTimeout(() => {
            const bestMove = this.getBotMove();
            if (bestMove !== -1) {
                this.board[bestMove] = this.currentPlayer;
                this.updateBoard();
                if (this.checkWinner()) {
                    this.showResult("Bot menang!", "success");
                    this.scores[this.currentPlayer]++;
                    this.endGame();
                }
                else if (this.board.every((cell) => cell !== "")) {
                    this.showResult("Permainan seri!", "info");
                    this.scores.draw++;
                    this.endGame();
                }
                else {
                    this.currentPlayer = "X";
                    this.isPlayerTurn = true;
                    this.updateDisplay();
                }
            }
            // Remove thinking indicator
            if (board)
                board.classList.remove("bot-thinking");
        }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
    }
    getBotMove() {
        const availableMoves = this.board.map((cell, index) => (cell === "" ? index : -1)).filter((index) => index !== -1);
        if (availableMoves.length === 0)
            return -1;
        switch (this.botDifficulty) {
            case "easy":
                return this.getRandomMove(availableMoves);
            case "medium":
                return Math.random() < 0.7 ? this.getBestMove() : this.getRandomMove(availableMoves);
            case "hard":
                return this.getBestMove();
            default:
                return this.getRandomMove(availableMoves);
        }
    }
    getRandomMove(availableMoves) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === "") {
                this.board[i] = "O";
                const score = this.minimax(this.board, 0, false);
                this.board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }
    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinnerForBoard(board);
        if (winner === "O")
            return 10 - depth;
        if (winner === "X")
            return depth - 10;
        if (board.every((cell) => cell !== ""))
            return 0;
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    checkWinnerForBoard(board) {
        const winPatterns = this.generateWinPatterns();
        for (const pattern of winPatterns) {
            if (pattern.length > 0 && board[pattern[0]]) {
                const symbol = board[pattern[0]];
                if (pattern.every((index) => board[index] === symbol)) {
                    return symbol;
                }
            }
        }
        return null;
    }
    checkWinner() {
        const winPatterns = this.generateWinPatterns();
        return winPatterns.some((pattern) => {
            if (pattern.length > 0 && this.board[pattern[0]]) {
                const symbol = this.board[pattern[0]];
                return pattern.every((index) => this.board[index] === symbol);
            }
            return false;
        });
    }
    generateWinPatterns() {
        const patterns = [];
        const size = this.boardSize;
        // Rows
        for (let row = 0; row < size; row++) {
            const pattern = [];
            for (let col = 0; col < size; col++) {
                pattern.push(row * size + col);
            }
            patterns.push(pattern);
        }
        // Columns
        for (let col = 0; col < size; col++) {
            const pattern = [];
            for (let row = 0; row < size; row++) {
                pattern.push(row * size + col);
            }
            patterns.push(pattern);
        }
        // Main diagonal (top-left to bottom-right)
        const mainDiagonal = [];
        for (let i = 0; i < size; i++) {
            mainDiagonal.push(i * size + i);
        }
        patterns.push(mainDiagonal);
        // Anti-diagonal (top-right to bottom-left)
        const antiDiagonal = [];
        for (let i = 0; i < size; i++) {
            antiDiagonal.push(i * size + (size - 1 - i));
        }
        patterns.push(antiDiagonal);
        return patterns;
    }
    handleGameEnd(result) {
        this.gameEnded = true;
        this.stopTimer();
        // Update statistics
        this.statistics.gamesPlayed++;
        if (result === "X") {
            this.statistics.player1Wins++;
        }
        else if (result === "O") {
            this.statistics.player2Wins++;
        }
        else {
            this.statistics.draws++;
        }
        this.saveStatistics();
        this.updateStatisticsDisplay();
        // Handle tournament
        if (this.tournament.isActive) {
            if (result === "X") {
                this.tournament.player1Score++;
            }
            else if (result === "O") {
                this.tournament.player2Score++;
            }
            this.tournament.currentGame++;
            this.updateTournamentDisplay();
            // Check if tournament is complete
            const maxScore = Math.ceil(this.tournament.totalGames / 2);
            if (this.tournament.player1Score >= maxScore || this.tournament.player2Score >= maxScore || this.tournament.currentGame > this.tournament.totalGames) {
                this.endTournament();
            }
            else {
                // Continue tournament
                setTimeout(() => {
                    this.startNewGame();
                }, 2000);
            }
        }
        this.endGame();
    }
    endTournament() {
        const winner = this.tournament.player1Score > this.tournament.player2Score ? "Player 1" : this.tournament.player2Score > this.tournament.player1Score ? "Player 2" : "Tie";
        this.showResult(`Tournament selesai! Pemenang: ${winner}`, "success");
        // Reset tournament
        this.tournament.currentGame = 1;
        this.tournament.player1Score = 0;
        this.tournament.player2Score = 0;
        this.updateTournamentDisplay();
    }
    endGame() {
        this.gameEnded = true;
        this.saveScores();
        this.updateScoreDisplay();
    }
    updateBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            const cellElement = cell;
            cellElement.textContent = this.board[index];
            cellElement.className = "cell";
            if (this.board[index]) {
                // Add symbol-specific styling
                const symbol = this.board[index];
                if (symbol === this.player1Symbol) {
                    cellElement.classList.add("x");
                }
                else if (symbol === this.player2Symbol) {
                    cellElement.classList.add("o");
                }
                // Add custom symbol classes for special styling
                switch (symbol) {
                    case "♠":
                        cellElement.classList.add("symbol-spade");
                        break;
                    case "♥":
                        cellElement.classList.add("symbol-heart");
                        break;
                    case "♦":
                        cellElement.classList.add("symbol-diamond");
                        break;
                    case "♣":
                        cellElement.classList.add("symbol-club");
                        break;
                    case "★":
                        cellElement.classList.add("symbol-star");
                        break;
                    case "●":
                    case "○":
                        cellElement.classList.add("symbol-circle");
                        break;
                    case "▲":
                    case "▼":
                        cellElement.classList.add("symbol-triangle");
                        break;
                    case "■":
                    case "□":
                        cellElement.classList.add("symbol-square");
                        break;
                }
            }
        });
    }
    updateDisplay() {
        const currentPlayerElement = document.getElementById("currentPlayer");
        if (currentPlayerElement) {
            const symbol = this.currentPlayer === "X" ? this.player1Symbol : this.player2Symbol;
            currentPlayerElement.textContent = `${this.currentPlayer} (${symbol})`;
        }
    }
    updateScoreDisplay() {
        const scoreXElement = document.getElementById("scoreX");
        const scoreOElement = document.getElementById("scoreO");
        const scoreDrawElement = document.getElementById("scoreDraw");
        if (scoreXElement)
            scoreXElement.textContent = this.scores.X.toString();
        if (scoreOElement)
            scoreOElement.textContent = this.scores.O.toString();
        if (scoreDrawElement)
            scoreDrawElement.textContent = this.scores.draw.toString();
    }
    showResult(message, type) {
        const resultElement = document.getElementById("ticTacToeResult");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `result ${type}`;
        }
    }
    clearResult() {
        const resultElement = document.getElementById("ticTacToeResult");
        if (resultElement) {
            resultElement.textContent = "";
            resultElement.className = "result";
        }
    }
    resetScores() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.saveScores();
        this.updateScoreDisplay();
    }
    loadScores() {
        const saved = localStorage.getItem("ticTacToeScores");
        if (saved) {
            this.scores = JSON.parse(saved);
        }
        this.updateScoreDisplay();
    }
    // Timer Methods
    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();
        this.timerInterval = window.setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimeOut();
            }
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    updateTimerDisplay() {
        const timeLeftElement = document.getElementById("timeLeft");
        const timerProgress = document.getElementById("timerProgress");
        if (timeLeftElement) {
            timeLeftElement.textContent = this.timeLeft.toString();
        }
        if (timerProgress) {
            const percentage = (this.timeLeft / 30) * 100;
            timerProgress.style.width = `${percentage}%`;
        }
    }
    handleTimeOut() {
        // Switch to next player when time runs out
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        this.isPlayerTurn = this.gameMode === "pvp" || this.currentPlayer === "X";
        this.updateDisplay();
        if (this.timerEnabled && !this.gameEnded) {
            this.startTimer();
        }
        // If it's bot's turn after timeout, make bot move
        if (this.gameMode === "pvb" && !this.isPlayerTurn) {
            this.makeBotMove();
        }
    }
    // Board Creation
    createBoardElements() {
        const boardElement = document.getElementById("ticTacToeBoard");
        if (!boardElement)
            return;
        // Clear existing cells
        boardElement.innerHTML = "";
        // Update board class for size
        boardElement.className = `board size-${this.boardSize}`;
        // Create new cells
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = i.toString();
            cell.addEventListener("click", () => this.makeMove(i));
            boardElement.appendChild(cell);
        }
    }
    // Display Update Methods
    updateGameModeDisplay() {
        const gameModeElement = document.getElementById("gameMode");
        if (gameModeElement) {
            gameModeElement.textContent = `Mode: ${this.gameMode === "pvp" ? "Player vs Player" : "Player vs Bot"}`;
        }
    }
    updateBoardSizeDisplay() {
        const boardSizeElement = document.getElementById("boardSize");
        if (boardSizeElement) {
            boardSizeElement.textContent = `Board: ${this.boardSize}x${this.boardSize}`;
        }
    }
    updateTournamentDisplay() {
        const tournamentStatusDiv = document.getElementById("tournamentStatus");
        const currentGameElement = document.getElementById("currentGame");
        const totalGamesElement = document.getElementById("totalGames");
        const tournamentScoreP1Element = document.getElementById("tournamentScoreP1");
        const tournamentScoreP2Element = document.getElementById("tournamentScoreP2");
        if (tournamentStatusDiv) {
            tournamentStatusDiv.classList.toggle("hidden", !this.tournament.isActive);
        }
        if (currentGameElement)
            currentGameElement.textContent = this.tournament.currentGame.toString();
        if (totalGamesElement)
            totalGamesElement.textContent = this.tournament.totalGames.toString();
        if (tournamentScoreP1Element)
            tournamentScoreP1Element.textContent = this.tournament.player1Score.toString();
        if (tournamentScoreP2Element)
            tournamentScoreP2Element.textContent = this.tournament.player2Score.toString();
    }
    updateStatisticsDisplay() {
        const gamesPlayedElement = document.getElementById("gamesPlayed");
        const winRateP1Element = document.getElementById("winRateP1");
        const winRateP2Element = document.getElementById("winRateP2");
        const drawRateElement = document.getElementById("drawRate");
        if (gamesPlayedElement)
            gamesPlayedElement.textContent = this.statistics.gamesPlayed.toString();
        if (this.statistics.gamesPlayed > 0) {
            const winRateP1 = Math.round((this.statistics.player1Wins / this.statistics.gamesPlayed) * 100);
            const winRateP2 = Math.round((this.statistics.player2Wins / this.statistics.gamesPlayed) * 100);
            const drawRate = Math.round((this.statistics.draws / this.statistics.gamesPlayed) * 100);
            if (winRateP1Element)
                winRateP1Element.textContent = `${winRateP1}%`;
            if (winRateP2Element)
                winRateP2Element.textContent = `${winRateP2}%`;
            if (drawRateElement)
                drawRateElement.textContent = `${drawRate}%`;
        }
        else {
            if (winRateP1Element)
                winRateP1Element.textContent = "0%";
            if (winRateP2Element)
                winRateP2Element.textContent = "0%";
            if (drawRateElement)
                drawRateElement.textContent = "0%";
        }
    }
    // Statistics Methods
    loadStatistics() {
        const saved = localStorage.getItem("ticTacToeStatistics");
        if (saved) {
            this.statistics = JSON.parse(saved);
        }
    }
    saveStatistics() {
        localStorage.setItem("ticTacToeStatistics", JSON.stringify(this.statistics));
    }
    resetStatistics() {
        this.statistics = {
            gamesPlayed: 0,
            player1Wins: 0,
            player2Wins: 0,
            draws: 0,
        };
        this.saveStatistics();
        this.updateStatisticsDisplay();
    }
    saveScores() {
        localStorage.setItem("ticTacToeScores", JSON.stringify(this.scores));
    }
}
// Memory Card Game Class
class MemoryCardGame {
    constructor() {
        this.initializeThemes();
        this.loadStatistics();
        this.initializeGameState();
        this.initializeEventListeners();
        this.initializeUI();
    }
    initializeThemes() {
        this.themes = {
            numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"],
            colors: [
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FFEAA7",
                "#DDA0DD",
                "#98D8C8",
                "#F7DC6F",
                "#BB8FCE",
                "#85C1E9",
                "#F8C471",
                "#82E0AA",
                "#F1948A",
                "#85C1E9",
                "#D7BDE2",
                "#A3E4D7",
                "#FAD7A0",
                "#D5A6BD",
                "#AED6F1",
                "#A9DFBF",
                "#F9E79F",
                "#D2B4DE",
                "#A8E6CF",
                "#FFB3BA",
                "#BFEFFF",
                "#FFFFCC",
                "#FFDFBA",
                "#E0BBE4",
                "#957DAD",
                "#FEC8D8",
                "#FFDFD3",
                "#C7CEEA",
            ],
            symbols: ["★", "♠", "♥", "♦", "♣", "♪", "♫", "☀", "☁", "☂", "❄", "⚡", "🌙", "⭐", "💫", "🔥", "💧", "🌈", "🍀", "🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🌿", "🍃", "🌱", "🌲", "🌳", "🌴", "🌵"],
            emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏"],
        };
    }
    initializeGameState() {
        this.gameState = {
            cards: [],
            flippedCards: [],
            moves: 0,
            matches: 0,
            totalPairs: 8,
            startTime: 0,
            endTime: 0,
            isGameActive: false,
            difficulty: 4,
            theme: "numbers",
            mode: "relaxed",
            timeLeft: 60,
            timerInterval: null,
        };
    }
    initializeEventListeners() {
        // Difficulty buttons
        document.getElementById("memory4x4")?.addEventListener("click", () => {
            this.setDifficulty(4);
        });
        document.getElementById("memory6x6")?.addEventListener("click", () => {
            this.setDifficulty(6);
        });
        document.getElementById("memory8x8")?.addEventListener("click", () => {
            this.setDifficulty(8);
        });
        // Theme buttons
        document.getElementById("themeNumbers")?.addEventListener("click", () => {
            this.setTheme("numbers");
        });
        document.getElementById("themeColors")?.addEventListener("click", () => {
            this.setTheme("colors");
        });
        document.getElementById("themeSymbols")?.addEventListener("click", () => {
            this.setTheme("symbols");
        });
        document.getElementById("themeEmojis")?.addEventListener("click", () => {
            this.setTheme("emojis");
        });
        // Mode buttons
        document.getElementById("memoryRelaxed")?.addEventListener("click", () => {
            this.setMode("relaxed");
        });
        document.getElementById("memorySpeed")?.addEventListener("click", () => {
            this.setMode("speed");
        });
        // Game controls
        document.getElementById("newMemoryGame")?.addEventListener("click", () => {
            this.startNewGame();
        });
        document.getElementById("resetMemoryStats")?.addEventListener("click", () => {
            this.resetStatistics();
        });
    }
    initializeUI() {
        // Set initial button states
        document.querySelectorAll(".memory-difficulty-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("memory4x4")?.classList.add("active");
        document.querySelectorAll(".theme-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("themeNumbers")?.classList.add("active");
        document.querySelectorAll(".memory-mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("memoryRelaxed")?.classList.add("active");
        // Hide speed timer initially
        const speedTimer = document.getElementById("memorySpeedTimer");
        if (speedTimer)
            speedTimer.classList.add("hidden");
        this.updateStatisticsDisplay();
        this.updateGameInfo();
    }
    // Game Control Methods
    startNewGame() {
        this.stopTimer();
        this.gameState.cards = [];
        this.gameState.flippedCards = [];
        this.gameState.moves = 0;
        this.gameState.matches = 0;
        this.gameState.totalPairs = (this.gameState.difficulty * this.gameState.difficulty) / 2;
        this.gameState.startTime = Date.now();
        this.gameState.endTime = 0;
        this.gameState.isGameActive = true;
        this.gameState.timeLeft = this.gameState.mode === "speed" ? 60 : 0;
        this.generateCards();
        this.createBoard();
        this.updateGameInfo();
        this.clearResult();
        if (this.gameState.mode === "speed") {
            this.startTimer();
        }
    }
    setDifficulty(difficulty) {
        this.gameState.difficulty = difficulty;
        // Update UI
        document.querySelectorAll(".memory-difficulty-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`memory${difficulty}x${difficulty}`)?.classList.add("active");
        this.startNewGame();
    }
    setTheme(theme) {
        this.gameState.theme = theme;
        // Update UI
        document.querySelectorAll(".theme-btn").forEach((btn) => btn.classList.remove("active"));
        const themeId = theme.charAt(0).toUpperCase() + theme.slice(1);
        document.getElementById(`theme${themeId}`)?.classList.add("active");
        this.startNewGame();
    }
    setMode(mode) {
        this.gameState.mode = mode;
        // Update UI
        document.querySelectorAll(".memory-mode-btn").forEach((btn) => btn.classList.remove("active"));
        const modeId = mode.charAt(0).toUpperCase() + mode.slice(1);
        document.getElementById(`memory${modeId}`)?.classList.add("active");
        // Show/hide speed timer
        const speedTimer = document.getElementById("memorySpeedTimer");
        if (speedTimer) {
            speedTimer.classList.toggle("hidden", mode !== "speed");
        }
        this.startNewGame();
    }
    // Card Generation and Board Creation
    generateCards() {
        const totalCards = this.gameState.difficulty * this.gameState.difficulty;
        const pairs = totalCards / 2;
        const themeValues = this.themes[this.gameState.theme];
        // Select random values for pairs
        const selectedValues = this.shuffleArray([...themeValues]).slice(0, pairs);
        // Create pairs
        const cardValues = [];
        selectedValues.forEach((value) => {
            cardValues.push(value, value);
        });
        // Shuffle cards
        const shuffledValues = this.shuffleArray(cardValues);
        // Create card objects
        this.gameState.cards = shuffledValues.map((value, index) => ({
            id: index,
            value: value,
            isFlipped: false,
            isMatched: false,
        }));
    }
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    createBoard() {
        const board = document.getElementById("memoryBoard");
        if (!board)
            return;
        // Clear existing cards
        board.innerHTML = "";
        board.className = `memory-board size-${this.gameState.difficulty}`;
        // Create card elements
        this.gameState.cards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.className = `memory-card theme-${this.gameState.theme}`;
            cardElement.dataset.cardId = index.toString();
            const cardContent = document.createElement("div");
            cardContent.className = "card-content";
            cardContent.textContent = "?";
            cardElement.appendChild(cardContent);
            cardElement.addEventListener("click", () => this.flipCard(index));
            board.appendChild(cardElement);
            card.element = cardElement;
        });
    }
    // Game Logic
    flipCard(cardIndex) {
        if (!this.gameState.isGameActive)
            return;
        const card = this.gameState.cards[cardIndex];
        if (!card || card.isFlipped || card.isMatched || this.gameState.flippedCards.length >= 2)
            return;
        // Flip the card
        card.isFlipped = true;
        this.gameState.flippedCards.push(card);
        this.updateCardDisplay(card);
        if (this.gameState.flippedCards.length === 2) {
            this.gameState.moves++;
            this.updateGameInfo();
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }
    checkMatch() {
        const [card1, card2] = this.gameState.flippedCards;
        if (card1.value === card2.value) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            this.gameState.matches++;
            if (card1.element)
                card1.element.classList.add("matched");
            if (card2.element)
                card2.element.classList.add("matched");
            // Check if game is complete
            if (this.gameState.matches === this.gameState.totalPairs) {
                this.endGame(true);
            }
        }
        else {
            // No match
            card1.isFlipped = false;
            card2.isFlipped = false;
            if (card1.element) {
                card1.element.classList.add("wrong");
                setTimeout(() => card1.element?.classList.remove("wrong"), 500);
            }
            if (card2.element) {
                card2.element.classList.add("wrong");
                setTimeout(() => card2.element?.classList.remove("wrong"), 500);
            }
            setTimeout(() => {
                this.updateCardDisplay(card1);
                this.updateCardDisplay(card2);
            }, 500);
        }
        this.gameState.flippedCards = [];
        this.updateGameInfo();
    }
    updateCardDisplay(card) {
        if (!card.element)
            return;
        const cardContent = card.element.querySelector(".card-content");
        if (!cardContent)
            return;
        if (card.isFlipped || card.isMatched) {
            cardContent.textContent = card.value;
            card.element.classList.add("flipped");
            // Apply theme-specific styling for colors
            if (this.gameState.theme === "colors") {
                card.element.style.backgroundColor = card.value;
            }
        }
        else {
            cardContent.textContent = "?";
            card.element.classList.remove("flipped");
            card.element.style.backgroundColor = "";
        }
    }
    // Timer Methods
    startTimer() {
        this.gameState.timeLeft = 60;
        this.updateTimerDisplay();
        this.gameState.timerInterval = window.setInterval(() => {
            this.gameState.timeLeft--;
            this.updateTimerDisplay();
            if (this.gameState.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }
    stopTimer() {
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
            this.gameState.timerInterval = null;
        }
    }
    updateTimerDisplay() {
        const timeLeftElement = document.getElementById("memoryTimeLeft");
        const timerProgress = document.getElementById("memoryTimerProgress");
        if (timeLeftElement) {
            timeLeftElement.textContent = this.gameState.timeLeft.toString();
        }
        if (timerProgress) {
            const percentage = (this.gameState.timeLeft / 60) * 100;
            timerProgress.style.width = `${percentage}%`;
        }
    }
    // Game End and Statistics
    endGame(won) {
        this.gameState.isGameActive = false;
        this.gameState.endTime = Date.now();
        this.stopTimer();
        const gameTime = Math.floor((this.gameState.endTime - this.gameState.startTime) / 1000);
        if (won) {
            this.showResult(`Selamat! Game selesai dalam ${gameTime} detik dengan ${this.gameState.moves} moves!`, "success");
            // Update statistics
            this.statistics.gamesWon++;
            if (this.statistics.bestTime === 0 || gameTime < this.statistics.bestTime) {
                this.statistics.bestTime = gameTime;
            }
            if (this.statistics.bestMoves === 0 || this.gameState.moves < this.statistics.bestMoves) {
                this.statistics.bestMoves = this.gameState.moves;
            }
        }
        else {
            this.showResult("Waktu habis! Coba lagi!", "error");
        }
        this.statistics.gamesPlayed++;
        this.statistics.totalTime += gameTime;
        this.statistics.totalMoves += this.gameState.moves;
        this.saveStatistics();
        this.updateStatisticsDisplay();
    }
    // Display Update Methods
    updateGameInfo() {
        const movesElement = document.getElementById("memoryMoves");
        const matchesElement = document.getElementById("memoryMatches");
        const totalElement = document.getElementById("memoryTotal");
        const timeElement = document.getElementById("memoryTime");
        if (movesElement)
            movesElement.textContent = this.gameState.moves.toString();
        if (matchesElement)
            matchesElement.textContent = this.gameState.matches.toString();
        if (totalElement)
            totalElement.textContent = this.gameState.totalPairs.toString();
        if (timeElement && this.gameState.startTime > 0) {
            const currentTime = this.gameState.endTime > 0 ? this.gameState.endTime : Date.now();
            const elapsed = Math.floor((currentTime - this.gameState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timeElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
    }
    updateStatisticsDisplay() {
        const gamesPlayedElement = document.getElementById("memoryGamesPlayed");
        const bestTimeElement = document.getElementById("memoryBestTime");
        const bestMovesElement = document.getElementById("memoryBestMoves");
        const successRateElement = document.getElementById("memorySuccessRate");
        if (gamesPlayedElement)
            gamesPlayedElement.textContent = this.statistics.gamesPlayed.toString();
        if (bestTimeElement) {
            if (this.statistics.bestTime > 0) {
                const minutes = Math.floor(this.statistics.bestTime / 60);
                const seconds = this.statistics.bestTime % 60;
                bestTimeElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            }
            else {
                bestTimeElement.textContent = "--:--";
            }
        }
        if (bestMovesElement) {
            bestMovesElement.textContent = this.statistics.bestMoves > 0 ? this.statistics.bestMoves.toString() : "--";
        }
        if (successRateElement) {
            const successRate = this.statistics.gamesPlayed > 0 ? Math.round((this.statistics.gamesWon / this.statistics.gamesPlayed) * 100) : 0;
            successRateElement.textContent = `${successRate}%`;
        }
    }
    showResult(message, type) {
        const resultElement = document.getElementById("memoryResult");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `result ${type}`;
        }
    }
    clearResult() {
        const resultElement = document.getElementById("memoryResult");
        if (resultElement) {
            resultElement.textContent = "";
            resultElement.className = "result";
        }
    }
    // Statistics Methods
    loadStatistics() {
        const saved = localStorage.getItem("memoryCardStatistics");
        if (saved) {
            this.statistics = JSON.parse(saved);
        }
        else {
            this.statistics = {
                gamesPlayed: 0,
                gamesWon: 0,
                bestTime: 0,
                bestMoves: 0,
                totalTime: 0,
                totalMoves: 0,
            };
        }
    }
    saveStatistics() {
        localStorage.setItem("memoryCardStatistics", JSON.stringify(this.statistics));
    }
    resetStatistics() {
        this.statistics = {
            gamesPlayed: 0,
            gamesWon: 0,
            bestTime: 0,
            bestMoves: 0,
            totalTime: 0,
            totalMoves: 0,
        };
        this.saveStatistics();
        this.updateStatisticsDisplay();
    }
}
// 2048 Game Class
class Game2048 {
    constructor() {
        this.loadStatistics();
        this.initializeGameState();
        this.initializeEventListeners();
        this.initializeUI();
    }
    initializeGameState() {
        this.gameState = {
            grid: [],
            score: 0,
            bestScore: this.statistics.bestScore,
            moves: 0,
            gridSize: 4,
            gameMode: "manual",
            isGameOver: false,
            hasWon: false,
            canUndo: false,
            aiSpeed: 500,
            nextTileId: 1,
        };
    }
    initializeEventListeners() {
        // Grid size buttons
        document.getElementById("grid3x3")?.addEventListener("click", () => {
            this.setGridSize(3);
        });
        document.getElementById("grid4x4")?.addEventListener("click", () => {
            this.setGridSize(4);
        });
        document.getElementById("grid5x5")?.addEventListener("click", () => {
            this.setGridSize(5);
        });
        document.getElementById("grid6x6")?.addEventListener("click", () => {
            this.setGridSize(6);
        });
        // Game mode buttons
        document.getElementById("manualMode")?.addEventListener("click", () => {
            this.setGameMode("manual");
        });
        document.getElementById("aiMode")?.addEventListener("click", () => {
            this.setGameMode("ai");
        });
        document.getElementById("assistMode")?.addEventListener("click", () => {
            this.setGameMode("assist");
        });
        // AI controls
        document.getElementById("aiStep")?.addEventListener("click", () => {
            this.aiStep();
        });
        document.getElementById("aiAutoPlay")?.addEventListener("click", () => {
            this.aiAutoPlay();
        });
        document.getElementById("aiStop")?.addEventListener("click", () => {
            this.aiStop();
        });
        // AI speed slider
        const aiSpeedSlider = document.getElementById("aiSpeed");
        aiSpeedSlider?.addEventListener("input", (e) => {
            const target = e.target;
            this.gameState.aiSpeed = parseInt(target.value);
            this.updateAISpeedDisplay();
        });
        // Game controls
        document.getElementById("new2048Game")?.addEventListener("click", () => {
            this.startNewGame();
        });
        document.getElementById("undo2048")?.addEventListener("click", () => {
            this.undoMove();
        });
        document.getElementById("reset2048Stats")?.addEventListener("click", () => {
            this.resetStatistics();
        });
        // Keyboard controls
        document.addEventListener("keydown", (e) => {
            if (document.getElementById("game2048")?.classList.contains("hidden"))
                return;
            if (this.gameState.gameMode === "manual" || this.gameState.gameMode === "assist") {
                this.handleKeyPress(e);
            }
        });
    }
    initializeUI() {
        // Set initial button states
        document.querySelectorAll(".grid-size-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("grid4x4")?.classList.add("active");
        document.querySelectorAll(".game2048-mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("manualMode")?.classList.add("active");
        // Hide AI settings initially
        const aiSettings = document.getElementById("aiSettings");
        if (aiSettings)
            aiSettings.classList.add("hidden");
        // Hide AI instructions initially
        const aiInstructions = document.getElementById("aiInstructions");
        if (aiInstructions)
            aiInstructions.classList.add("hidden");
        this.updateAISpeedDisplay();
        this.updateStatisticsDisplay();
        this.updateAchievements();
    }
    // Game Control Methods
    startNewGame() {
        this.aiStop();
        this.initializeGrid();
        this.gameState.score = 0;
        this.gameState.moves = 0;
        this.gameState.isGameOver = false;
        this.gameState.hasWon = false;
        this.gameState.canUndo = false;
        this.gameState.nextTileId = 1;
        this.gameState.previousState = undefined;
        this.addRandomTile();
        this.addRandomTile();
        this.createBoard();
        this.updateDisplay();
        this.clearResult();
    }
    setGridSize(size) {
        this.gameState.gridSize = size;
        // Update UI
        document.querySelectorAll(".grid-size-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`grid${size}x${size}`)?.classList.add("active");
        this.startNewGame();
    }
    setGameMode(mode) {
        this.aiStop();
        this.gameState.gameMode = mode;
        // Update UI
        document.querySelectorAll(".game2048-mode-btn").forEach((btn) => btn.classList.remove("active"));
        const modeId = mode.charAt(0).toUpperCase() + mode.slice(1);
        document.getElementById(`${mode}Mode`)?.classList.add("active");
        // Show/hide AI settings and instructions
        const aiSettings = document.getElementById("aiSettings");
        const aiInstructions = document.getElementById("aiInstructions");
        if (aiSettings) {
            aiSettings.classList.toggle("hidden", mode === "manual");
        }
        if (aiInstructions) {
            aiInstructions.classList.toggle("hidden", mode === "manual");
        }
        // Update button states
        this.updateAIButtonStates();
    }
    // Grid Management
    initializeGrid() {
        const size = this.gameState.gridSize;
        this.gameState.grid = Array(size)
            .fill(null)
            .map(() => Array(size).fill(null));
    }
    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < this.gameState.gridSize; row++) {
            for (let col = 0; col < this.gameState.gridSize; col++) {
                if (!this.gameState.grid[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length === 0)
            return false;
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        const newTile = {
            value,
            row: randomCell.row,
            col: randomCell.col,
            id: this.gameState.nextTileId++,
            isNew: true,
            isMerged: false,
        };
        this.gameState.grid[randomCell.row][randomCell.col] = newTile;
        return true;
    }
    createBoard() {
        const board = document.getElementById("game2048Board");
        if (!board)
            return;
        // Clear existing tiles
        board.innerHTML = "";
        board.className = `game2048-board size-${this.gameState.gridSize}`;
        // Create tile elements
        for (let row = 0; row < this.gameState.gridSize; row++) {
            for (let col = 0; col < this.gameState.gridSize; col++) {
                const tileElement = document.createElement("div");
                tileElement.className = "game2048-tile";
                tileElement.dataset.row = row.toString();
                tileElement.dataset.col = col.toString();
                const tile = this.gameState.grid[row][col];
                if (tile) {
                    this.updateTileElement(tileElement, tile);
                    tile.element = tileElement;
                }
                board.appendChild(tileElement);
            }
        }
    }
    updateTileElement(element, tile) {
        element.textContent = tile.value.toString();
        element.className = `game2048-tile tile-${tile.value}`;
        if (tile.isNew) {
            element.classList.add("new-tile");
            tile.isNew = false;
        }
        if (tile.isMerged) {
            element.classList.add("merged-tile");
            tile.isMerged = false;
        }
    }
    // Game Logic
    handleKeyPress(e) {
        if (this.gameState.isGameOver)
            return;
        let direction = null;
        switch (e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                direction = "up";
                break;
            case "ArrowDown":
            case "s":
            case "S":
                direction = "down";
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                direction = "left";
                break;
            case "ArrowRight":
            case "d":
            case "D":
                direction = "right";
                break;
        }
        if (direction) {
            e.preventDefault();
            this.makeMove(direction);
        }
    }
    makeMove(direction) {
        if (this.gameState.isGameOver)
            return false;
        // Save current state for undo
        this.saveCurrentState();
        const moved = this.moveTiles(direction);
        if (moved) {
            this.gameState.moves++;
            this.addRandomTile();
            this.updateDisplay();
            this.checkGameState();
            this.gameState.canUndo = true;
            // Check for achievements
            this.checkAchievements();
            return true;
        }
        else {
            // Restore previous state if no move was made
            this.gameState.previousState = undefined;
            return false;
        }
    }
    moveTiles(direction) {
        let moved = false;
        const size = this.gameState.gridSize;
        // Clear merge flags
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const tile = this.gameState.grid[row][col];
                if (tile) {
                    tile.isMerged = false;
                }
            }
        }
        switch (direction) {
            case "left":
                for (let row = 0; row < size; row++) {
                    moved = this.moveRowLeft(row) || moved;
                }
                break;
            case "right":
                for (let row = 0; row < size; row++) {
                    moved = this.moveRowRight(row) || moved;
                }
                break;
            case "up":
                for (let col = 0; col < size; col++) {
                    moved = this.moveColumnUp(col) || moved;
                }
                break;
            case "down":
                for (let col = 0; col < size; col++) {
                    moved = this.moveColumnDown(col) || moved;
                }
                break;
        }
        return moved;
    }
    moveRowLeft(row) {
        const tiles = this.gameState.grid[row].filter((tile) => tile !== null);
        const newRow = Array(this.gameState.gridSize).fill(null);
        let moved = false;
        let writeIndex = 0;
        for (let i = 0; i < tiles.length; i++) {
            const currentTile = tiles[i];
            if (writeIndex > 0 && newRow[writeIndex - 1] && newRow[writeIndex - 1].value === currentTile.value && !newRow[writeIndex - 1].isMerged) {
                // Merge tiles
                const targetTile = newRow[writeIndex - 1];
                targetTile.value *= 2;
                targetTile.isMerged = true;
                this.gameState.score += targetTile.value;
                moved = true;
            }
            else {
                // Place tile
                newRow[writeIndex] = {
                    ...currentTile,
                    col: writeIndex,
                };
                if (currentTile.col !== writeIndex) {
                    moved = true;
                }
                writeIndex++;
            }
        }
        this.gameState.grid[row] = newRow;
        return moved;
    }
    moveRowRight(row) {
        const tiles = this.gameState.grid[row].filter((tile) => tile !== null);
        const newRow = Array(this.gameState.gridSize).fill(null);
        let moved = false;
        let writeIndex = this.gameState.gridSize - 1;
        for (let i = tiles.length - 1; i >= 0; i--) {
            const currentTile = tiles[i];
            if (writeIndex < this.gameState.gridSize - 1 && newRow[writeIndex + 1] && newRow[writeIndex + 1].value === currentTile.value && !newRow[writeIndex + 1].isMerged) {
                // Merge tiles
                const targetTile = newRow[writeIndex + 1];
                targetTile.value *= 2;
                targetTile.isMerged = true;
                this.gameState.score += targetTile.value;
                moved = true;
            }
            else {
                // Place tile
                newRow[writeIndex] = {
                    ...currentTile,
                    col: writeIndex,
                };
                if (currentTile.col !== writeIndex) {
                    moved = true;
                }
                writeIndex--;
            }
        }
        this.gameState.grid[row] = newRow;
        return moved;
    }
    moveColumnUp(col) {
        const tiles = [];
        for (let row = 0; row < this.gameState.gridSize; row++) {
            if (this.gameState.grid[row][col]) {
                tiles.push(this.gameState.grid[row][col]);
            }
        }
        // Clear column
        for (let row = 0; row < this.gameState.gridSize; row++) {
            this.gameState.grid[row][col] = null;
        }
        let moved = false;
        let writeIndex = 0;
        for (let i = 0; i < tiles.length; i++) {
            const currentTile = tiles[i];
            if (writeIndex > 0 && this.gameState.grid[writeIndex - 1][col] && this.gameState.grid[writeIndex - 1][col].value === currentTile.value && !this.gameState.grid[writeIndex - 1][col].isMerged) {
                // Merge tiles
                const targetTile = this.gameState.grid[writeIndex - 1][col];
                targetTile.value *= 2;
                targetTile.isMerged = true;
                this.gameState.score += targetTile.value;
                moved = true;
            }
            else {
                // Place tile
                this.gameState.grid[writeIndex][col] = {
                    ...currentTile,
                    row: writeIndex,
                };
                if (currentTile.row !== writeIndex) {
                    moved = true;
                }
                writeIndex++;
            }
        }
        return moved;
    }
    moveColumnDown(col) {
        const tiles = [];
        for (let row = this.gameState.gridSize - 1; row >= 0; row--) {
            if (this.gameState.grid[row][col]) {
                tiles.push(this.gameState.grid[row][col]);
            }
        }
        // Clear column
        for (let row = 0; row < this.gameState.gridSize; row++) {
            this.gameState.grid[row][col] = null;
        }
        let moved = false;
        let writeIndex = this.gameState.gridSize - 1;
        for (let i = 0; i < tiles.length; i++) {
            const currentTile = tiles[i];
            if (writeIndex < this.gameState.gridSize - 1 && this.gameState.grid[writeIndex + 1][col] && this.gameState.grid[writeIndex + 1][col].value === currentTile.value && !this.gameState.grid[writeIndex + 1][col].isMerged) {
                // Merge tiles
                const targetTile = this.gameState.grid[writeIndex + 1][col];
                targetTile.value *= 2;
                targetTile.isMerged = true;
                this.gameState.score += targetTile.value;
                moved = true;
            }
            else {
                // Place tile
                this.gameState.grid[writeIndex][col] = {
                    ...currentTile,
                    row: writeIndex,
                };
                if (currentTile.row !== writeIndex) {
                    moved = true;
                }
                writeIndex--;
            }
        }
        return moved;
    }
    // AI Methods
    aiStep() {
        if (this.gameState.isGameOver)
            return;
        const bestMove = this.getBestMove();
        if (bestMove) {
            this.makeMove(bestMove);
        }
    }
    aiAutoPlay() {
        if (this.gameState.aiInterval)
            return;
        this.gameState.aiInterval = window.setInterval(() => {
            if (this.gameState.isGameOver) {
                this.aiStop();
                return;
            }
            this.aiStep();
        }, this.gameState.aiSpeed);
        this.updateAIButtonStates();
    }
    aiStop() {
        if (this.gameState.aiInterval) {
            clearInterval(this.gameState.aiInterval);
            this.gameState.aiInterval = undefined;
        }
        this.updateAIButtonStates();
    }
    getBestMove() {
        const directions = ["up", "down", "left", "right"];
        let bestDirection = null;
        let bestScore = -1;
        for (const direction of directions) {
            const score = this.evaluateMove(direction);
            if (score > bestScore) {
                bestScore = score;
                bestDirection = direction;
            }
        }
        return bestDirection;
    }
    evaluateMove(direction) {
        // Create a copy of the current state
        const originalGrid = this.cloneGrid();
        const originalScore = this.gameState.score;
        // Try the move
        const moved = this.moveTiles(direction);
        if (!moved) {
            // Restore state and return low score
            this.gameState.grid = originalGrid;
            this.gameState.score = originalScore;
            return -1;
        }
        // Calculate score based on multiple factors
        let score = 0;
        // Factor 1: Score gained
        score += (this.gameState.score - originalScore) * 10;
        // Factor 2: Empty cells (more is better)
        score += this.getEmptyCellCount() * 100;
        // Factor 3: Monotonicity (tiles in order)
        score += this.getMonotonicity() * 50;
        // Factor 4: Smoothness (similar adjacent tiles)
        score += this.getSmoothness() * 30;
        // Restore state
        this.gameState.grid = originalGrid;
        this.gameState.score = originalScore;
        return score;
    }
    cloneGrid() {
        return this.gameState.grid.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
    }
    getEmptyCellCount() {
        let count = 0;
        for (let row = 0; row < this.gameState.gridSize; row++) {
            for (let col = 0; col < this.gameState.gridSize; col++) {
                if (!this.gameState.grid[row][col]) {
                    count++;
                }
            }
        }
        return count;
    }
    getMonotonicity() {
        let score = 0;
        const size = this.gameState.gridSize;
        // Check rows
        for (let row = 0; row < size; row++) {
            let increasing = 0;
            let decreasing = 0;
            for (let col = 0; col < size - 1; col++) {
                const current = this.gameState.grid[row][col];
                const next = this.gameState.grid[row][col + 1];
                if (current && next) {
                    if (current.value <= next.value)
                        increasing++;
                    if (current.value >= next.value)
                        decreasing++;
                }
            }
            score += Math.max(increasing, decreasing);
        }
        // Check columns
        for (let col = 0; col < size; col++) {
            let increasing = 0;
            let decreasing = 0;
            for (let row = 0; row < size - 1; row++) {
                const current = this.gameState.grid[row][col];
                const next = this.gameState.grid[row + 1][col];
                if (current && next) {
                    if (current.value <= next.value)
                        increasing++;
                    if (current.value >= next.value)
                        decreasing++;
                }
            }
            score += Math.max(increasing, decreasing);
        }
        return score;
    }
    getSmoothness() {
        let score = 0;
        const size = this.gameState.gridSize;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const current = this.gameState.grid[row][col];
                if (!current)
                    continue;
                // Check right neighbor
                if (col < size - 1) {
                    const right = this.gameState.grid[row][col + 1];
                    if (right) {
                        score -= Math.abs(Math.log2(current.value) - Math.log2(right.value));
                    }
                }
                // Check bottom neighbor
                if (row < size - 1) {
                    const bottom = this.gameState.grid[row + 1][col];
                    if (bottom) {
                        score -= Math.abs(Math.log2(current.value) - Math.log2(bottom.value));
                    }
                }
            }
        }
        return score;
    }
    // Game State Management
    saveCurrentState() {
        this.gameState.previousState = {
            grid: this.cloneGrid(),
            score: this.gameState.score,
            moves: this.gameState.moves,
        };
    }
    undoMove() {
        if (!this.gameState.canUndo || !this.gameState.previousState)
            return;
        this.gameState.grid = this.gameState.previousState.grid;
        this.gameState.score = this.gameState.previousState.score;
        this.gameState.moves = this.gameState.previousState.moves;
        this.gameState.canUndo = false;
        this.gameState.previousState = undefined;
        this.createBoard();
        this.updateDisplay();
    }
    checkGameState() {
        // Check for win condition
        if (!this.gameState.hasWon) {
            for (let row = 0; row < this.gameState.gridSize; row++) {
                for (let col = 0; col < this.gameState.gridSize; col++) {
                    const tile = this.gameState.grid[row][col];
                    if (tile && tile.value >= 2048) {
                        this.gameState.hasWon = true;
                        this.showResult("Congratulations! You reached 2048!", "success");
                        this.statistics.gamesWon++;
                        break;
                    }
                }
                if (this.gameState.hasWon)
                    break;
            }
        }
        // Check for game over
        if (this.getEmptyCellCount() === 0 && !this.canMove()) {
            this.gameState.isGameOver = true;
            this.aiStop();
            this.showResult("Game Over! No more moves available.", "error");
            this.statistics.gamesPlayed++;
            this.updateStatistics();
        }
    }
    canMove() {
        const directions = ["up", "down", "left", "right"];
        for (const direction of directions) {
            const originalGrid = this.cloneGrid();
            const moved = this.moveTiles(direction);
            this.gameState.grid = originalGrid;
            if (moved)
                return true;
        }
        return false;
    }
    // Achievements
    checkAchievements() {
        const highestTile = this.getHighestTile();
        const achievementValues = [128, 256, 512, 1024, 2048, 4096, 8192, 16384];
        for (const value of achievementValues) {
            if (highestTile >= value) {
                const achievement = this.statistics.achievements.find((a) => a.value === value);
                if (achievement && !achievement.unlocked) {
                    achievement.unlocked = true;
                    achievement.dateUnlocked = new Date();
                    this.unlockAchievement(value);
                }
            }
        }
        this.updateAchievements();
    }
    unlockAchievement(value) {
        const achievementElement = document.getElementById(`achievement${value}`);
        if (achievementElement) {
            achievementElement.classList.add("unlocked", "just-unlocked");
            const statusElement = achievementElement.querySelector(".achievement-status");
            if (statusElement) {
                statusElement.textContent = "🏆";
            }
            // Remove animation class after animation completes
            setTimeout(() => {
                achievementElement.classList.remove("just-unlocked");
            }, 600);
            // Show notification
            this.showResult(`Achievement Unlocked: Reached ${value}!`, "success");
        }
    }
    getHighestTile() {
        let highest = 0;
        for (let row = 0; row < this.gameState.gridSize; row++) {
            for (let col = 0; col < this.gameState.gridSize; col++) {
                const tile = this.gameState.grid[row][col];
                if (tile && tile.value > highest) {
                    highest = tile.value;
                }
            }
        }
        return highest;
    }
    // Display Updates
    updateDisplay() {
        this.updateGameInfo();
        this.updateBoard();
        this.updateAIButtonStates();
    }
    updateGameInfo() {
        const scoreElement = document.getElementById("game2048Score");
        const bestElement = document.getElementById("game2048Best");
        const movesElement = document.getElementById("game2048Moves");
        const highestElement = document.getElementById("game2048Highest");
        if (scoreElement)
            scoreElement.textContent = this.gameState.score.toString();
        if (bestElement)
            bestElement.textContent = this.gameState.bestScore.toString();
        if (movesElement)
            movesElement.textContent = this.gameState.moves.toString();
        if (highestElement)
            highestElement.textContent = this.getHighestTile().toString();
        // Update best score
        if (this.gameState.score > this.gameState.bestScore) {
            this.gameState.bestScore = this.gameState.score;
            this.statistics.bestScore = this.gameState.score;
        }
    }
    updateBoard() {
        const board = document.getElementById("game2048Board");
        if (!board)
            return;
        // Update existing tiles
        for (let row = 0; row < this.gameState.gridSize; row++) {
            for (let col = 0; col < this.gameState.gridSize; col++) {
                const tileElement = board.children[row * this.gameState.gridSize + col];
                const tile = this.gameState.grid[row][col];
                if (tile) {
                    this.updateTileElement(tileElement, tile);
                    tile.element = tileElement;
                }
                else {
                    tileElement.textContent = "";
                    tileElement.className = "game2048-tile";
                }
            }
        }
    }
    updateAchievements() {
        for (const achievement of this.statistics.achievements) {
            const element = document.getElementById(`achievement${achievement.value}`);
            if (element) {
                if (achievement.unlocked) {
                    element.classList.add("unlocked");
                    const statusElement = element.querySelector(".achievement-status");
                    if (statusElement) {
                        statusElement.textContent = "🏆";
                    }
                }
            }
        }
    }
    updateAIButtonStates() {
        const aiStepBtn = document.getElementById("aiStep");
        const aiAutoBtn = document.getElementById("aiAutoPlay");
        const aiStopBtn = document.getElementById("aiStop");
        const undoBtn = document.getElementById("undo2048");
        const isAIMode = this.gameState.gameMode === "ai" || this.gameState.gameMode === "assist";
        const isRunning = !!this.gameState.aiInterval;
        if (aiStepBtn)
            aiStepBtn.disabled = !isAIMode || isRunning || this.gameState.isGameOver;
        if (aiAutoBtn)
            aiAutoBtn.disabled = !isAIMode || isRunning || this.gameState.isGameOver;
        if (aiStopBtn)
            aiStopBtn.disabled = !isRunning;
        if (undoBtn)
            undoBtn.disabled = !this.gameState.canUndo || isRunning;
    }
    updateAISpeedDisplay() {
        const speedValue = document.getElementById("aiSpeedValue");
        if (speedValue) {
            speedValue.textContent = `${this.gameState.aiSpeed}ms`;
        }
    }
    showResult(message, type) {
        const resultElement = document.getElementById("game2048Result");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `result ${type}`;
        }
    }
    clearResult() {
        const resultElement = document.getElementById("game2048Result");
        if (resultElement) {
            resultElement.textContent = "";
            resultElement.className = "result";
        }
    }
    // Statistics Management
    loadStatistics() {
        const saved = localStorage.getItem("game2048Statistics");
        if (saved) {
            this.statistics = JSON.parse(saved);
        }
        else {
            this.statistics = {
                gamesPlayed: 0,
                gamesWon: 0,
                bestScore: 0,
                totalScore: 0,
                totalMoves: 0,
                achievements: [
                    { value: 128, unlocked: false },
                    { value: 256, unlocked: false },
                    { value: 512, unlocked: false },
                    { value: 1024, unlocked: false },
                    { value: 2048, unlocked: false },
                    { value: 4096, unlocked: false },
                    { value: 8192, unlocked: false },
                    { value: 16384, unlocked: false },
                ],
                highestTile: 0,
            };
        }
    }
    saveStatistics() {
        localStorage.setItem("game2048Statistics", JSON.stringify(this.statistics));
    }
    updateStatistics() {
        this.statistics.totalScore += this.gameState.score;
        this.statistics.totalMoves += this.gameState.moves;
        const highestTile = this.getHighestTile();
        if (highestTile > this.statistics.highestTile) {
            this.statistics.highestTile = highestTile;
        }
        this.saveStatistics();
        this.updateStatisticsDisplay();
    }
    updateStatisticsDisplay() {
        // Update best score display
        const bestElement = document.getElementById("game2048Best");
        if (bestElement) {
            bestElement.textContent = this.statistics.bestScore.toString();
        }
    }
    resetStatistics() {
        this.statistics = {
            gamesPlayed: 0,
            gamesWon: 0,
            bestScore: 0,
            totalScore: 0,
            totalMoves: 0,
            achievements: [
                { value: 128, unlocked: false },
                { value: 256, unlocked: false },
                { value: 512, unlocked: false },
                { value: 1024, unlocked: false },
                { value: 2048, unlocked: false },
                { value: 4096, unlocked: false },
                { value: 8192, unlocked: false },
                { value: 16384, unlocked: false },
            ],
            highestTile: 0,
        };
        this.gameState.bestScore = 0;
        this.saveStatistics();
        this.updateStatisticsDisplay();
        this.updateAchievements();
        // Reset achievement UI
        const achievements = document.querySelectorAll(".achievement");
        achievements.forEach((achievement) => {
            achievement.classList.remove("unlocked");
            const statusElement = achievement.querySelector(".achievement-status");
            if (statusElement) {
                statusElement.textContent = "🔒";
            }
        });
    }
}
// Tetris Game Class
class TetrisGame {
    constructor() {
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.PIECES = {
            I: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
            O: [
                [
                    [1, 1],
                    [1, 1],
                ],
            ],
            T: [
                [
                    [0, 1, 0],
                    [1, 1, 1],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [1, 0],
                ],
                [
                    [1, 1, 1],
                    [0, 1, 0],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [0, 1],
                ],
            ],
            S: [
                [
                    [0, 1, 1],
                    [1, 1, 0],
                ],
                [
                    [1, 0],
                    [1, 1],
                    [0, 1],
                ],
            ],
            Z: [
                [
                    [1, 1, 0],
                    [0, 1, 1],
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 0],
                ],
            ],
            J: [
                [
                    [1, 0, 0],
                    [1, 1, 1],
                ],
                [
                    [1, 1],
                    [1, 0],
                    [1, 0],
                ],
                [
                    [1, 1, 1],
                    [0, 0, 1],
                ],
                [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                ],
            ],
            L: [
                [
                    [0, 0, 1],
                    [1, 1, 1],
                ],
                [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                ],
                [
                    [1, 1, 1],
                    [1, 0, 0],
                ],
                [
                    [1, 1],
                    [0, 1],
                    [0, 1],
                ],
            ],
        };
        this.loadStatistics();
        this.initializeGameState();
        this.initializeEventListeners();
        this.initializeUI();
    }
    initializeGameState() {
        this.gameState = {
            board: Array(this.BOARD_HEIGHT)
                .fill(null)
                .map(() => Array(this.BOARD_WIDTH).fill(null)),
            currentPiece: null,
            nextPiece: null,
            heldPiece: null,
            canHold: true,
            score: 0,
            level: 1,
            lines: 0,
            gameMode: "manual",
            theme: "classic",
            isGameOver: false,
            isPaused: false,
            dropInterval: 1000,
            lastDrop: 0,
            aiSpeed: 200,
        };
    }
    initializeEventListeners() {
        // Game mode buttons
        document.getElementById("tetrisManual")?.addEventListener("click", () => {
            this.setGameMode("manual");
        });
        document.getElementById("tetrisAI")?.addEventListener("click", () => {
            this.setGameMode("ai");
        });
        document.getElementById("tetrisAssist")?.addEventListener("click", () => {
            this.setGameMode("assist");
        });
        // Theme buttons
        document.getElementById("tetrisClassic")?.addEventListener("click", () => {
            this.setTheme("classic");
        });
        document.getElementById("tetrisNeon")?.addEventListener("click", () => {
            this.setTheme("neon");
        });
        document.getElementById("tetrisRetro")?.addEventListener("click", () => {
            this.setTheme("retro");
        });
        document.getElementById("tetrisMinimal")?.addEventListener("click", () => {
            this.setTheme("minimal");
        });
        // Speed control
        const speedSlider = document.getElementById("tetrisSpeed");
        speedSlider?.addEventListener("input", (e) => {
            const target = e.target;
            this.gameState.level = parseInt(target.value);
            this.updateDropInterval();
            this.updateSpeedDisplay();
        });
        // AI controls
        document.getElementById("tetrisAIStep")?.addEventListener("click", () => {
            this.aiStep();
        });
        document.getElementById("tetrisAIPlay")?.addEventListener("click", () => {
            this.aiAutoPlay();
        });
        document.getElementById("tetrisAIStop")?.addEventListener("click", () => {
            this.aiStop();
        });
        // AI speed slider
        const aiSpeedSlider = document.getElementById("tetrisAISpeed");
        aiSpeedSlider?.addEventListener("input", (e) => {
            const target = e.target;
            this.gameState.aiSpeed = parseInt(target.value);
            this.updateAISpeedDisplay();
        });
        // Game controls
        document.getElementById("newTetrisGame")?.addEventListener("click", () => {
            this.startNewGame();
        });
        document.getElementById("pauseTetris")?.addEventListener("click", () => {
            this.togglePause();
        });
        document.getElementById("tetrisHoldBtn")?.addEventListener("click", () => {
            this.holdPiece();
        });
        document.getElementById("resetTetrisStats")?.addEventListener("click", () => {
            this.resetStatistics();
        });
        // Keyboard controls
        document.addEventListener("keydown", (e) => {
            if (document.getElementById("tetrisGame")?.classList.contains("hidden"))
                return;
            if (this.gameState.gameMode === "manual" || this.gameState.gameMode === "assist") {
                this.handleKeyPress(e);
            }
        });
    }
    initializeUI() {
        // Set initial button states
        document.querySelectorAll(".tetris-mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("tetrisManual")?.classList.add("active");
        document.querySelectorAll(".tetris-theme-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById("tetrisClassic")?.classList.add("active");
        // Hide AI settings initially
        const aiSettings = document.getElementById("tetrisAISettings");
        if (aiSettings)
            aiSettings.classList.add("hidden");
        // Hide AI instructions initially
        const aiInstructions = document.getElementById("tetrisAIInstructions");
        if (aiInstructions)
            aiInstructions.classList.add("hidden");
        this.updateSpeedDisplay();
        this.updateAISpeedDisplay();
        this.updateStatisticsDisplay();
    }
    // Game Control Methods
    startNewGame() {
        this.aiStop();
        this.gameState.board = Array(this.BOARD_HEIGHT)
            .fill(null)
            .map(() => Array(this.BOARD_WIDTH).fill(null));
        this.gameState.score = 0;
        this.gameState.level = parseInt(document.getElementById("tetrisSpeed")?.value || "1");
        this.gameState.lines = 0;
        this.gameState.isGameOver = false;
        this.gameState.isPaused = false;
        this.gameState.canHold = true;
        this.gameState.heldPiece = null;
        this.gameState.currentPiece = null;
        this.gameState.nextPiece = this.generateRandomPiece();
        this.updateDropInterval();
        this.spawnNewPiece();
        this.createBoard();
        this.updateDisplay();
        this.clearResult();
        this.startGameLoop();
    }
    setGameMode(mode) {
        this.aiStop();
        this.gameState.gameMode = mode;
        // Update UI
        document.querySelectorAll(".tetris-mode-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`tetris${mode.charAt(0).toUpperCase() + mode.slice(1)}`)?.classList.add("active");
        // Show/hide AI settings and instructions
        const aiSettings = document.getElementById("tetrisAISettings");
        const aiInstructions = document.getElementById("tetrisAIInstructions");
        if (aiSettings) {
            aiSettings.classList.toggle("hidden", mode === "manual");
        }
        if (aiInstructions) {
            aiInstructions.classList.toggle("hidden", mode === "manual");
        }
        this.updateAIButtonStates();
    }
    setTheme(theme) {
        this.gameState.theme = theme;
        // Update UI
        document.querySelectorAll(".tetris-theme-btn").forEach((btn) => btn.classList.remove("active"));
        document.getElementById(`tetris${theme.charAt(0).toUpperCase() + theme.slice(1)}`)?.classList.add("active");
        // Update board theme
        const board = document.getElementById("tetrisBoard");
        if (board) {
            board.className = `tetris-board theme-${theme}`;
        }
    }
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const pauseBtn = document.getElementById("pauseTetris");
        if (pauseBtn) {
            pauseBtn.textContent = this.gameState.isPaused ? "Resume" : "Pause";
            pauseBtn.classList.toggle("paused", this.gameState.isPaused);
        }
        if (this.gameState.isPaused) {
            this.stopGameLoop();
            this.aiStop();
        }
        else {
            this.startGameLoop();
            if (this.gameState.gameMode === "ai" && this.gameState.aiInterval) {
                this.aiAutoPlay();
            }
        }
    }
    // Piece Management
    generateRandomPiece() {
        const types = ["I", "O", "T", "S", "Z", "J", "L"];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            type,
            shape: this.PIECES[type][0],
            x: Math.floor(this.BOARD_WIDTH / 2) - 1,
            y: 0,
            rotation: 0,
        };
    }
    spawnNewPiece() {
        this.gameState.currentPiece = this.gameState.nextPiece;
        this.gameState.nextPiece = this.generateRandomPiece();
        this.gameState.canHold = true;
        if (this.gameState.currentPiece && this.isValidPosition(this.gameState.currentPiece)) {
            this.updateNextPieceDisplay();
            return true;
        }
        else {
            this.gameOver();
            return false;
        }
    }
    holdPiece() {
        if (!this.gameState.canHold || !this.gameState.currentPiece)
            return;
        if (this.gameState.heldPiece) {
            // Swap current and held pieces
            const temp = this.gameState.currentPiece;
            this.gameState.currentPiece = this.gameState.heldPiece;
            this.gameState.heldPiece = temp;
            // Reset position
            this.gameState.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - 1;
            this.gameState.currentPiece.y = 0;
            this.gameState.currentPiece.rotation = 0;
            this.gameState.currentPiece.shape = this.PIECES[this.gameState.currentPiece.type][0];
        }
        else {
            // Hold current piece and spawn new one
            this.gameState.heldPiece = this.gameState.currentPiece;
            this.spawnNewPiece();
        }
        this.gameState.canHold = false;
        this.updateHoldPieceDisplay();
        this.updateBoard();
    }
    // Movement and Collision
    handleKeyPress(e) {
        if (this.gameState.isGameOver || this.gameState.isPaused)
            return;
        switch (e.key) {
            case "ArrowLeft":
            case "a":
            case "A":
                this.movePiece(-1, 0);
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.movePiece(1, 0);
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.movePiece(0, 1);
                break;
            case "ArrowUp":
            case "w":
            case "W":
                this.rotatePiece();
                break;
            case " ":
                e.preventDefault();
                this.hardDrop();
                break;
            case "c":
            case "C":
                this.holdPiece();
                break;
        }
    }
    movePiece(dx, dy) {
        if (!this.gameState.currentPiece)
            return false;
        const newPiece = {
            ...this.gameState.currentPiece,
            x: this.gameState.currentPiece.x + dx,
            y: this.gameState.currentPiece.y + dy,
        };
        if (this.isValidPosition(newPiece)) {
            this.gameState.currentPiece = newPiece;
            this.updateBoard();
            return true;
        }
        return false;
    }
    rotatePiece() {
        if (!this.gameState.currentPiece)
            return false;
        const rotations = this.PIECES[this.gameState.currentPiece.type];
        const newRotation = (this.gameState.currentPiece.rotation + 1) % rotations.length;
        const newPiece = {
            ...this.gameState.currentPiece,
            rotation: newRotation,
            shape: rotations[newRotation],
        };
        if (this.isValidPosition(newPiece)) {
            this.gameState.currentPiece = newPiece;
            this.updateBoard();
            return true;
        }
        return false;
    }
    hardDrop() {
        if (!this.gameState.currentPiece)
            return;
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        this.gameState.score += dropDistance * 2;
        this.placePiece();
    }
    isValidPosition(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    // Check boundaries
                    if (boardX < 0 || boardX >= this.BOARD_WIDTH || boardY >= this.BOARD_HEIGHT) {
                        return false;
                    }
                    // Check collision with placed pieces
                    if (boardY >= 0 && this.gameState.board[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    placePiece() {
        if (!this.gameState.currentPiece)
            return;
        // Place piece on board
        for (let y = 0; y < this.gameState.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.gameState.currentPiece.shape[y].length; x++) {
                if (this.gameState.currentPiece.shape[y][x]) {
                    const boardX = this.gameState.currentPiece.x + x;
                    const boardY = this.gameState.currentPiece.y + y;
                    if (boardY >= 0) {
                        this.gameState.board[boardY][boardX] = this.gameState.currentPiece.type;
                    }
                }
            }
        }
        // Check for line clears
        this.clearLines();
        // Spawn new piece
        this.spawnNewPiece();
        this.updateBoard();
    }
    clearLines() {
        const linesToClear = [];
        // Find complete lines
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            if (this.gameState.board[y].every((cell) => cell !== null)) {
                linesToClear.push(y);
            }
        }
        if (linesToClear.length === 0)
            return;
        // Animate line clearing
        this.animateLineClear(linesToClear);
        // Remove cleared lines
        for (const lineIndex of linesToClear.reverse()) {
            this.gameState.board.splice(lineIndex, 1);
            this.gameState.board.unshift(Array(this.BOARD_WIDTH).fill(null));
        }
        // Update statistics
        this.gameState.lines += linesToClear.length;
        this.updateLineClearStats(linesToClear.length);
        // Calculate score
        const baseScore = [0, 100, 300, 500, 800][linesToClear.length] || 0;
        this.gameState.score += baseScore * this.gameState.level;
        // Level up
        const newLevel = Math.floor(this.gameState.lines / 10) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.updateDropInterval();
            this.showLevelUp();
        }
        this.updateDisplay();
    }
    // AI Methods
    aiStep() {
        if (this.gameState.isGameOver || this.gameState.isPaused)
            return;
        const bestMove = this.getBestMove();
        if (bestMove) {
            this.executeBestMove(bestMove);
        }
    }
    aiAutoPlay() {
        if (this.gameState.aiInterval)
            return;
        this.gameState.aiInterval = window.setInterval(() => {
            if (this.gameState.isGameOver || this.gameState.isPaused) {
                this.aiStop();
                return;
            }
            this.aiStep();
        }, this.gameState.aiSpeed);
        this.updateAIButtonStates();
    }
    aiStop() {
        if (this.gameState.aiInterval) {
            clearInterval(this.gameState.aiInterval);
            this.gameState.aiInterval = undefined;
        }
        this.updateAIButtonStates();
    }
    getBestMove() {
        if (!this.gameState.currentPiece)
            return null;
        let bestScore = -Infinity;
        let bestMove = null;
        // Try all possible positions and rotations
        for (let rotation = 0; rotation < this.PIECES[this.gameState.currentPiece.type].length; rotation++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const testPiece = {
                    ...this.gameState.currentPiece,
                    x,
                    y: 0,
                    rotation,
                    shape: this.PIECES[this.gameState.currentPiece.type][rotation],
                };
                // Drop piece to lowest valid position
                while (this.isValidPosition({ ...testPiece, y: testPiece.y + 1 })) {
                    testPiece.y++;
                }
                if (this.isValidPosition(testPiece)) {
                    const score = this.evaluatePosition(testPiece);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { x, rotation };
                    }
                }
            }
        }
        return bestMove;
    }
    evaluatePosition(piece) {
        // Create a copy of the board with the piece placed
        const testBoard = this.gameState.board.map((row) => [...row]);
        // Place the piece
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    if (boardY >= 0 && boardY < this.BOARD_HEIGHT && boardX >= 0 && boardX < this.BOARD_WIDTH) {
                        testBoard[boardY][boardX] = piece.type;
                    }
                }
            }
        }
        let score = 0;
        // Calculate metrics
        const linesCleared = this.countCompleteLines(testBoard);
        const holes = this.countHoles(testBoard);
        const bumpiness = this.calculateBumpiness(testBoard);
        const height = this.calculateHeight(testBoard);
        // Scoring weights (tuned for good performance)
        score += linesCleared * 1000; // Prioritize line clears
        score -= holes * 500; // Penalize holes
        score -= bumpiness * 100; // Penalize uneven surface
        score -= height * 50; // Prefer lower pieces
        return score;
    }
    countCompleteLines(board) {
        let count = 0;
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            if (board[y].every((cell) => cell !== null)) {
                count++;
            }
        }
        return count;
    }
    countHoles(board) {
        let holes = 0;
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            let foundBlock = false;
            for (let y = 0; y < this.BOARD_HEIGHT; y++) {
                if (board[y][x]) {
                    foundBlock = true;
                }
                else if (foundBlock) {
                    holes++;
                }
            }
        }
        return holes;
    }
    calculateBumpiness(board) {
        const heights = [];
        for (let x = 0; x < this.BOARD_WIDTH; x++) {
            let height = 0;
            for (let y = 0; y < this.BOARD_HEIGHT; y++) {
                if (board[y][x]) {
                    height = this.BOARD_HEIGHT - y;
                    break;
                }
            }
            heights.push(height);
        }
        let bumpiness = 0;
        for (let i = 0; i < heights.length - 1; i++) {
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
        }
        return bumpiness;
    }
    calculateHeight(board) {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            if (board[y].some((cell) => cell !== null)) {
                return this.BOARD_HEIGHT - y;
            }
        }
        return 0;
    }
    executeBestMove(move) {
        if (!this.gameState.currentPiece)
            return;
        // Rotate to target rotation
        while (this.gameState.currentPiece.rotation !== move.rotation) {
            if (!this.rotatePiece())
                break;
        }
        // Move to target x position
        const targetX = move.x;
        const currentX = this.gameState.currentPiece.x;
        if (currentX < targetX) {
            for (let i = 0; i < targetX - currentX; i++) {
                if (!this.movePiece(1, 0))
                    break;
            }
        }
        else if (currentX > targetX) {
            for (let i = 0; i < currentX - targetX; i++) {
                if (!this.movePiece(-1, 0))
                    break;
            }
        }
        // Hard drop
        this.hardDrop();
    }
    // Game Loop
    startGameLoop() {
        this.gameState.lastDrop = Date.now();
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    stopGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = undefined;
        }
    }
    update() {
        if (this.gameState.isGameOver || this.gameState.isPaused)
            return;
        const now = Date.now();
        if (now - this.gameState.lastDrop >= this.gameState.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.gameState.lastDrop = now;
        }
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    updateDropInterval() {
        // Speed increases with level
        this.gameState.dropInterval = Math.max(50, 1000 - (this.gameState.level - 1) * 50);
    }
    // Board and Display
    createBoard() {
        const board = document.getElementById("tetrisBoard");
        if (!board)
            return;
        // Clear existing cells
        board.innerHTML = "";
        board.className = `tetris-board theme-${this.gameState.theme}`;
        // Create cells
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const cell = document.createElement("div");
                cell.className = "tetris-cell";
                cell.dataset.x = x.toString();
                cell.dataset.y = y.toString();
                board.appendChild(cell);
            }
        }
        this.updateBoard();
    }
    updateBoard() {
        const board = document.getElementById("tetrisBoard");
        if (!board)
            return;
        const cells = board.children;
        // Clear all cells
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            cell.className = "tetris-cell";
        }
        // Draw placed pieces
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const cellIndex = y * this.BOARD_WIDTH + x;
                const cell = cells[cellIndex];
                if (this.gameState.board[y][x]) {
                    cell.classList.add("filled", this.gameState.board[y][x]);
                }
            }
        }
        // Draw current piece
        if (this.gameState.currentPiece) {
            for (let y = 0; y < this.gameState.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.gameState.currentPiece.shape[y].length; x++) {
                    if (this.gameState.currentPiece.shape[y][x]) {
                        const boardX = this.gameState.currentPiece.x + x;
                        const boardY = this.gameState.currentPiece.y + y;
                        if (boardX >= 0 && boardX < this.BOARD_WIDTH && boardY >= 0 && boardY < this.BOARD_HEIGHT) {
                            const cellIndex = boardY * this.BOARD_WIDTH + boardX;
                            const cell = cells[cellIndex];
                            cell.classList.add("filled", this.gameState.currentPiece.type);
                        }
                    }
                }
            }
        }
    }
    updateNextPieceDisplay() {
        const nextPreview = document.getElementById("tetrisNextPiece");
        if (!nextPreview || !this.gameState.nextPiece)
            return;
        nextPreview.innerHTML = "";
        const shape = this.gameState.nextPiece.shape;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement("div");
                cell.className = "tetris-cell";
                if (y < shape.length && x < shape[y].length && shape[y][x]) {
                    cell.classList.add("filled", this.gameState.nextPiece.type);
                }
                nextPreview.appendChild(cell);
            }
        }
    }
    updateHoldPieceDisplay() {
        const holdPreview = document.getElementById("tetrisHoldPiece");
        if (!holdPreview)
            return;
        holdPreview.innerHTML = "";
        if (this.gameState.heldPiece) {
            const shape = this.PIECES[this.gameState.heldPiece.type][0];
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const cell = document.createElement("div");
                    cell.className = "tetris-cell";
                    if (y < shape.length && x < shape[y].length && shape[y][x]) {
                        cell.classList.add("filled", this.gameState.heldPiece.type);
                    }
                    holdPreview.appendChild(cell);
                }
            }
        }
        else {
            for (let i = 0; i < 16; i++) {
                const cell = document.createElement("div");
                cell.className = "tetris-cell";
                holdPreview.appendChild(cell);
            }
        }
    }
    updateDisplay() {
        const scoreElement = document.getElementById("tetrisScore");
        const levelElement = document.getElementById("tetrisLevel");
        const linesElement = document.getElementById("tetrisLines");
        const bestElement = document.getElementById("tetrisBest");
        if (scoreElement)
            scoreElement.textContent = this.gameState.score.toString();
        if (levelElement)
            levelElement.textContent = this.gameState.level.toString();
        if (linesElement)
            linesElement.textContent = this.gameState.lines.toString();
        if (bestElement)
            bestElement.textContent = this.statistics.bestScore.toString();
        // Update best score
        if (this.gameState.score > this.statistics.bestScore) {
            this.statistics.bestScore = this.gameState.score;
            this.saveStatistics();
        }
        this.updateAIButtonStates();
    }
    // Statistics and Achievements
    updateLineClearStats(linesCleared) {
        switch (linesCleared) {
            case 1:
                this.statistics.lineClearStats.single++;
                document.getElementById("tetrisSingleCount").textContent = this.statistics.lineClearStats.single.toString();
                break;
            case 2:
                this.statistics.lineClearStats.double++;
                document.getElementById("tetrisDoubleCount").textContent = this.statistics.lineClearStats.double.toString();
                break;
            case 3:
                this.statistics.lineClearStats.triple++;
                document.getElementById("tetrisTripleCount").textContent = this.statistics.lineClearStats.triple.toString();
                break;
            case 4:
                this.statistics.lineClearStats.tetris++;
                document.getElementById("tetrisTetrisCount").textContent = this.statistics.lineClearStats.tetris.toString();
                this.showTetrisAchievement();
                break;
        }
        this.saveStatistics();
    }
    showTetrisAchievement() {
        this.showResult("TETRIS! 4 lines cleared!", "success");
        // Animate tetris achievement
        const tetrisAchievement = document.getElementById("tetrisTetris");
        if (tetrisAchievement) {
            tetrisAchievement.style.animation = "levelUp 0.5s ease-in-out";
            setTimeout(() => {
                tetrisAchievement.style.animation = "";
            }, 500);
        }
    }
    showLevelUp() {
        this.showResult(`Level Up! Now at Level ${this.gameState.level}`, "success");
        const levelElement = document.getElementById("tetrisLevel");
        if (levelElement) {
            levelElement.classList.add("level-up");
            setTimeout(() => {
                levelElement.classList.remove("level-up");
            }, 500);
        }
    }
    animateLineClear(lines) {
        const board = document.getElementById("tetrisBoard");
        if (!board)
            return;
        const cells = board.children;
        // Add clearing animation to cleared lines
        for (const lineIndex of lines) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const cellIndex = lineIndex * this.BOARD_WIDTH + x;
                const cell = cells[cellIndex];
                cell.classList.add("clearing");
            }
        }
        // Remove animation after completion
        setTimeout(() => {
            for (const lineIndex of lines) {
                for (let x = 0; x < this.BOARD_WIDTH; x++) {
                    const cellIndex = lineIndex * this.BOARD_WIDTH + x;
                    const cell = cells[cellIndex];
                    cell.classList.remove("clearing");
                }
            }
        }, 300);
    }
    // Game End
    gameOver() {
        this.gameState.isGameOver = true;
        this.stopGameLoop();
        this.aiStop();
        this.statistics.gamesPlayed++;
        this.statistics.totalScore += this.gameState.score;
        this.statistics.totalLines += this.gameState.lines;
        this.statistics.averageLevel = this.statistics.totalScore / this.statistics.gamesPlayed;
        this.saveStatistics();
        this.showResult(`Game Over! Final Score: ${this.gameState.score}`, "error");
    }
    // Utility Methods
    updateSpeedDisplay() {
        const speedValue = document.getElementById("tetrisSpeedValue");
        if (speedValue) {
            speedValue.textContent = `Level ${this.gameState.level}`;
        }
    }
    updateAISpeedDisplay() {
        const speedValue = document.getElementById("tetrisAISpeedValue");
        if (speedValue) {
            speedValue.textContent = `${this.gameState.aiSpeed}ms`;
        }
    }
    updateAIButtonStates() {
        const aiStepBtn = document.getElementById("tetrisAIStep");
        const aiPlayBtn = document.getElementById("tetrisAIPlay");
        const aiStopBtn = document.getElementById("tetrisAIStop");
        const holdBtn = document.getElementById("tetrisHoldBtn");
        const isAIMode = this.gameState.gameMode === "ai" || this.gameState.gameMode === "assist";
        const isRunning = !!this.gameState.aiInterval;
        if (aiStepBtn)
            aiStepBtn.disabled = !isAIMode || isRunning || this.gameState.isGameOver;
        if (aiPlayBtn)
            aiPlayBtn.disabled = !isAIMode || isRunning || this.gameState.isGameOver;
        if (aiStopBtn)
            aiStopBtn.disabled = !isRunning;
        if (holdBtn)
            holdBtn.disabled = !this.gameState.canHold || this.gameState.isGameOver;
    }
    showResult(message, type) {
        const resultElement = document.getElementById("tetrisResult");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `result ${type}`;
        }
    }
    clearResult() {
        const resultElement = document.getElementById("tetrisResult");
        if (resultElement) {
            resultElement.textContent = "";
            resultElement.className = "result";
        }
    }
    // Statistics Management
    loadStatistics() {
        const saved = localStorage.getItem("tetrisStatistics");
        if (saved) {
            this.statistics = JSON.parse(saved);
        }
        else {
            this.statistics = {
                gamesPlayed: 0,
                bestScore: 0,
                totalLines: 0,
                totalScore: 0,
                lineClearStats: {
                    single: 0,
                    double: 0,
                    triple: 0,
                    tetris: 0,
                },
                averageLevel: 0,
            };
        }
    }
    saveStatistics() {
        localStorage.setItem("tetrisStatistics", JSON.stringify(this.statistics));
    }
    updateStatisticsDisplay() {
        document.getElementById("tetrisSingleCount").textContent = this.statistics.lineClearStats.single.toString();
        document.getElementById("tetrisDoubleCount").textContent = this.statistics.lineClearStats.double.toString();
        document.getElementById("tetrisTripleCount").textContent = this.statistics.lineClearStats.triple.toString();
        document.getElementById("tetrisTetrisCount").textContent = this.statistics.lineClearStats.tetris.toString();
        const bestElement = document.getElementById("tetrisBest");
        if (bestElement) {
            bestElement.textContent = this.statistics.bestScore.toString();
        }
    }
    resetStatistics() {
        this.statistics = {
            gamesPlayed: 0,
            bestScore: 0,
            totalLines: 0,
            totalScore: 0,
            lineClearStats: {
                single: 0,
                double: 0,
                triple: 0,
                tetris: 0,
            },
            averageLevel: 0,
        };
        this.saveStatistics();
        this.updateStatisticsDisplay();
        this.updateDisplay();
    }
}
//# sourceMappingURL=main.js.map