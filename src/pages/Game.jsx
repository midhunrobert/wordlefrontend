import { useEffect, useState } from "react";
import API from "../api/api";
import Board from "../components/Board";
import './Game.css';

export default function Game({ onLeaderboardUpdate }) {
  const [game, setGame] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");

  const startNewGame = async () => {
    const res = await API.post("/game/start");
    setGame(res.data);
    setCurrentGuess("");
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!game || game.status !== "playing") return;

      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        if (currentGuess.length === 5) submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, game]);

  const submitGuess = async () => {
    if (!game) return;
    try {
      const res = await API.post("/game/guess", { gameId: game.id, guess: currentGuess });
      setGame(res.data);
      setCurrentGuess("");

      if (res.data.status !== "playing" && onLeaderboardUpdate) {
        onLeaderboardUpdate();
      }

    } catch (err) {
      alert(err.response?.data?.message || "Guess failed");
    }
  };

  return (
    <div className="wl-game-container">
<h2 className="wl-game-title">
  <span className="">FACTS</span>
  <span className="">wordle</span>
</h2>
      {game ? (
        <>
          <Board 
            guesses={game.guesses} 
            maxAttempts={game.maxAttempts} 
            currentGuess={currentGuess} 
          />
          {game.status !== "playing" && (
            <div className="wl-game-over">
              <p className="wl-game-over-text">
                Game Over! {game.status.toUpperCase()} — Solution: {game.solution}
              </p>
              <button className="wl-game-playagain" onClick={startNewGame}>Play Again</button>
            </div>
          )}
        </>
      ) : (
        <p className="wl-game-loading">Loading game...</p>
      )}
    </div>
  );
}
