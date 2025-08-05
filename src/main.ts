// Game Manager Class
class GameManager {
  private guessNumberGame: GuessNumberGame;
  private ticTacToeGame: TicTacToeGame;

  constructor() {
    this.guessNumberGame = new GuessNumberGame();
    this.ticTacToeGame = new TicTacToeGame();
    this.initializeEventListeners();
    this.showGameSelector();
  }

  private initializeEventListeners(): void {
    // Game selector buttons
    document.getElementById("guessNumberBtn")?.addEventListener("click", () => {
      this.showGuessNumberGame();
    });

    document.getElementById("ticTacToeBtn")?.addEventListener("click", () => {
      this.showTicTacToeGame();
    });

    // Back buttons
    document.getElementById("backFromGuess")?.addEventListener("click", () => {
      this.showGameSelector();
    });

    document.getElementById("backFromTicTacToe")?.addEventListener("click", () => {
      this.showGameSelector();
    });
  }

  private showGameSelector(): void {
    this.hideAllGames();
    document.querySelector(".game-selector")?.classList.remove("hidden");
  }

  private showGuessNumberGame(): void {
    this.hideAllGames();
    document.getElementById("guessNumberGame")?.classList.remove("hidden");
    this.guessNumberGame.startNewGame();
  }

  private showTicTacToeGame(): void {
    this.hideAllGames();
    document.getElementById("ticTacToeGame")?.classList.remove("hidden");
    this.ticTacToeGame.startNewGame();
  }

  private hideAllGames(): void {
    document.querySelector(".game-selector")?.classList.add("hidden");
    document.getElementById("guessNumberGame")?.classList.add("hidden");
    document.getElementById("ticTacToeGame")?.classList.add("hidden");
  }
}

// Guess Number Game Class
class GuessNumberGame {
  private targetNumber: number = 0;
  private attempts: number = 0;
  private bestScore: number = 0;
  private gameEnded: boolean = false;
  private minRange: number = 1;
  private maxRange: number = 100;
  private showingRange: boolean = false;
  private autoSolving: boolean = false;

  constructor() {
    this.loadBestScore();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
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

  public startNewGame(): void {
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

    const input = document.getElementById("guessInput") as HTMLInputElement;
    if (input) {
      input.value = "";
      input.disabled = false;
      input.classList.remove("auto-solving");
    }

    // Enable bot helper buttons
    this.toggleBotButtons(false);
  }

  private makeGuess(): void {
    if (this.gameEnded) return;

    const input = document.getElementById("guessInput") as HTMLInputElement;
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
    } else if (guess < this.targetNumber) {
      this.showResult("Terlalu kecil! Coba angka yang lebih besar.", "info");
      this.minRange = Math.max(this.minRange, guess + 1);
    } else {
      this.showResult("Terlalu besar! Coba angka yang lebih kecil.", "info");
      this.maxRange = Math.min(this.maxRange, guess - 1);
    }

    this.updateRange();
    this.clearHint();

    input.value = "";
  }

  private endGame(): void {
    this.gameEnded = true;
    const input = document.getElementById("guessInput") as HTMLInputElement;
    if (input) input.disabled = true;
    this.showNewGameButton(true);
  }

  private updateDisplay(): void {
    const attemptsElement = document.getElementById("attempts");
    if (attemptsElement) attemptsElement.textContent = this.attempts.toString();
  }

  private showResult(message: string, type: string): void {
    const resultElement = document.getElementById("guessResult");
    if (resultElement) {
      resultElement.textContent = message;
      resultElement.className = `result ${type}`;
    }
  }

  private clearResult(): void {
    const resultElement = document.getElementById("guessResult");
    if (resultElement) {
      resultElement.textContent = "";
      resultElement.className = "result";
    }
  }

  private showNewGameButton(show: boolean): void {
    const button = document.getElementById("newGameGuess");
    if (button) {
      button.classList.toggle("hidden", !show);
    }
  }

  private updateBestScore(): void {
    if (this.bestScore === 0 || this.attempts < this.bestScore) {
      this.bestScore = this.attempts;
      this.saveBestScore();
      const bestScoreElement = document.getElementById("bestScore");
      if (bestScoreElement) bestScoreElement.textContent = this.bestScore.toString();
    }
  }

  private loadBestScore(): void {
    const saved = localStorage.getItem("guessNumberBestScore");
    this.bestScore = saved ? parseInt(saved) : 0;
    const bestScoreElement = document.getElementById("bestScore");
    if (bestScoreElement) {
      bestScoreElement.textContent = this.bestScore > 0 ? this.bestScore.toString() : "-";
    }
  }

  private saveBestScore(): void {
    localStorage.setItem("guessNumberBestScore", this.bestScore.toString());
  }

  // Bot Helper Methods
  private getHint(): void {
    if (this.gameEnded) return;

    const mid = Math.floor((this.minRange + this.maxRange) / 2);
    const distance = Math.abs(this.targetNumber - mid);

    let hint = "";
    if (distance <= 5) {
      hint = `🔥 Sangat dekat! Coba sekitar ${mid}`;
    } else if (distance <= 15) {
      hint = `🌡️ Hangat! Range yang baik: ${this.minRange}-${this.maxRange}`;
    } else if (distance <= 30) {
      hint = `❄️ Dingin! Masih jauh dari target`;
    } else {
      hint = `🧊 Sangat dingin! Coba ubah strategi`;
    }

    this.showHint(hint);
  }

  private autoSolve(): void {
    if (this.gameEnded || this.autoSolving) return;

    this.autoSolving = true;
    const input = document.getElementById("guessInput") as HTMLInputElement;
    if (input) input.classList.add("auto-solving");

    this.toggleBotButtons(true);
    this.showHint("🤖 Bot sedang menyelesaikan...");

    // Use binary search algorithm
    this.binarySearchSolve();
  }

  private binarySearchSolve(): void {
    if (this.gameEnded) return;

    const guess = Math.floor((this.minRange + this.maxRange) / 2);
    const input = document.getElementById("guessInput") as HTMLInputElement;

    if (input) {
      input.value = guess.toString();

      setTimeout(() => {
        this.makeGuess();

        if (!this.gameEnded && this.autoSolving) {
          setTimeout(() => this.binarySearchSolve(), 1500);
        } else {
          this.autoSolving = false;
          input.classList.remove("auto-solving");
          this.toggleBotButtons(false);
          this.clearHint();
        }
      }, 1000);
    }
  }

  private toggleRange(): void {
    this.showingRange = !this.showingRange;
    this.updateRange();

    const button = document.getElementById("showRange");
    if (button) {
      button.textContent = this.showingRange ? "🙈 Sembunyikan Range" : "📊 Tampilkan Range";
    }
  }

  private updateRange(): void {
    const rangeElement = document.getElementById("currentRange");
    if (rangeElement) {
      if (this.showingRange) {
        rangeElement.textContent = `Range: ${this.minRange} - ${this.maxRange}`;
        rangeElement.classList.remove("hidden");
      } else {
        rangeElement.classList.add("hidden");
      }
    }
  }

  private showHint(message: string): void {
    const hintElement = document.getElementById("hintResult");
    if (hintElement) {
      hintElement.textContent = message;
      hintElement.classList.remove("hidden");
    }
  }

  private clearHint(): void {
    const hintElement = document.getElementById("hintResult");
    if (hintElement) {
      hintElement.textContent = "";
      hintElement.classList.add("hidden");
    }
  }

  private toggleBotButtons(disabled: boolean): void {
    const buttons = ["getHint", "autoSolve", "showRange"];
    buttons.forEach((id) => {
      const button = document.getElementById(id) as HTMLButtonElement;
      if (button) button.disabled = disabled;
    });
  }
}

// Bot difficulty levels
type BotDifficulty = "easy" | "medium" | "hard";
type GameMode = "pvp" | "pvb";

// Tic-Tac-Toe Game Class
class TicTacToeGame {
  private board: string[] = ["", "", "", "", "", "", "", "", ""];
  private currentPlayer: "X" | "O" = "X";
  private gameEnded: boolean = false;
  private scores = { X: 0, O: 0, draw: 0 };
  private gameMode: GameMode = "pvp";
  private botDifficulty: BotDifficulty = "medium";
  private isPlayerTurn: boolean = true;

  constructor() {
    this.loadScores();
    this.initializeEventListeners();
    this.initializeUI();
  }

  private initializeUI(): void {
    // Set initial game mode UI
    document.querySelectorAll(".mode-btn").forEach((btn) => btn.classList.remove("active"));
    document.getElementById("pvpMode")?.classList.add("active");

    // Set initial bot difficulty UI
    document.querySelectorAll(".difficulty-btn").forEach((btn) => btn.classList.remove("active"));
    document.getElementById("mediumBot")?.classList.add("active");

    // Hide bot difficulty initially (PvP mode)
    const botDifficultyDiv = document.getElementById("botDifficulty");
    if (botDifficultyDiv) {
      botDifficultyDiv.classList.add("hidden");
    }

    // Set initial game mode display
    const gameModeElement = document.getElementById("gameMode");
    if (gameModeElement) {
      gameModeElement.textContent = "Mode: Player vs Player";
    }
  }

  private initializeEventListeners(): void {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        this.makeMove(index);
      });
    });

    document.getElementById("newGameTicTacToe")?.addEventListener("click", () => {
      this.startNewGame();
    });

    document.getElementById("resetScore")?.addEventListener("click", () => {
      this.resetScores();
    });

    // Game mode buttons
    document.getElementById("pvpMode")?.addEventListener("click", () => {
      this.setGameMode("pvp");
    });

    document.getElementById("pvbMode")?.addEventListener("click", () => {
      this.setGameMode("pvb");
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

  public startNewGame(): void {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.currentPlayer = "X";
    this.gameEnded = false;
    this.isPlayerTurn = true;
    this.updateDisplay();
    this.clearResult();
    this.updateBoard();
  }

  private setGameMode(mode: GameMode): void {
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

  private setBotDifficulty(difficulty: BotDifficulty): void {
    this.botDifficulty = difficulty;

    // Update UI
    document.querySelectorAll(".difficulty-btn").forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`${difficulty}Bot`)?.classList.add("active");

    this.startNewGame();
  }

  private makeMove(index: number): void {
    if (this.gameEnded || this.board[index] !== "") return;

    // In PvB mode, only allow player moves when it's player's turn
    if (this.gameMode === "pvb" && !this.isPlayerTurn) return;

    this.board[index] = this.currentPlayer;
    this.updateBoard();

    if (this.checkWinner()) {
      const winner = this.gameMode === "pvb" && this.currentPlayer === "O" ? "Bot" : `Pemain ${this.currentPlayer}`;
      this.showResult(`${winner} menang!`, "success");
      this.scores[this.currentPlayer]++;
      this.endGame();
    } else if (this.board.every((cell) => cell !== "")) {
      this.showResult("Permainan seri!", "info");
      this.scores.draw++;
      this.endGame();
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.isPlayerTurn = this.gameMode === "pvp" || this.currentPlayer === "X";
      this.updateDisplay();

      // If it's bot's turn, make bot move
      if (this.gameMode === "pvb" && !this.isPlayerTurn) {
        this.makeBotMove();
      }
    }
  }

  private makeBotMove(): void {
    // Add visual indicator that bot is thinking
    const board = document.getElementById("ticTacToeBoard");
    if (board) board.classList.add("bot-thinking");

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
        } else if (this.board.every((cell) => cell !== "")) {
          this.showResult("Permainan seri!", "info");
          this.scores.draw++;
          this.endGame();
        } else {
          this.currentPlayer = "X";
          this.isPlayerTurn = true;
          this.updateDisplay();
        }
      }

      // Remove thinking indicator
      if (board) board.classList.remove("bot-thinking");
    }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
  }

  private getBotMove(): number {
    const availableMoves = this.board.map((cell, index) => (cell === "" ? index : -1)).filter((index) => index !== -1);

    if (availableMoves.length === 0) return -1;

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

  private getRandomMove(availableMoves: number[]): number {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  private getBestMove(): number {
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

  private minimax(board: string[], depth: number, isMaximizing: boolean): number {
    const winner = this.checkWinnerForBoard(board);

    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (board.every((cell) => cell !== "")) return 0;

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
    } else {
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

  private checkWinnerForBoard(board: string[]): string | null {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  private checkWinner(): boolean {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    return winPatterns.some((pattern) => {
      const [a, b, c] = pattern;
      return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c];
    });
  }

  private endGame(): void {
    this.gameEnded = true;
    this.saveScores();
    this.updateScoreDisplay();
  }

  private updateBoard(): void {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      const cellElement = cell as HTMLElement;
      cellElement.textContent = this.board[index];
      cellElement.className = "cell";
      if (this.board[index]) {
        cellElement.classList.add(this.board[index].toLowerCase());
      }
    });
  }

  private updateDisplay(): void {
    const currentPlayerElement = document.getElementById("currentPlayer");
    if (currentPlayerElement) currentPlayerElement.textContent = this.currentPlayer;
  }

  private updateScoreDisplay(): void {
    const scoreXElement = document.getElementById("scoreX");
    const scoreOElement = document.getElementById("scoreO");
    const scoreDrawElement = document.getElementById("scoreDraw");

    if (scoreXElement) scoreXElement.textContent = this.scores.X.toString();
    if (scoreOElement) scoreOElement.textContent = this.scores.O.toString();
    if (scoreDrawElement) scoreDrawElement.textContent = this.scores.draw.toString();
  }

  private showResult(message: string, type: string): void {
    const resultElement = document.getElementById("ticTacToeResult");
    if (resultElement) {
      resultElement.textContent = message;
      resultElement.className = `result ${type}`;
    }
  }

  private clearResult(): void {
    const resultElement = document.getElementById("ticTacToeResult");
    if (resultElement) {
      resultElement.textContent = "";
      resultElement.className = "result";
    }
  }

  private resetScores(): void {
    this.scores = { X: 0, O: 0, draw: 0 };
    this.saveScores();
    this.updateScoreDisplay();
  }

  private loadScores(): void {
    const saved = localStorage.getItem("ticTacToeScores");
    if (saved) {
      this.scores = JSON.parse(saved);
    }
    this.updateScoreDisplay();
  }

  private saveScores(): void {
    localStorage.setItem("ticTacToeScores", JSON.stringify(this.scores));
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GameManager();
});
