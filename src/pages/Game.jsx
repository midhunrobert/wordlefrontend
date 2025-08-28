import { useEffect, useState } from "react";
import API from "../api/api";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import './Game.css';

export default function Game({ onLeaderboardUpdate }) {
  const [game, setGame] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [keyStates, setKeyStates] = useState({});
  const [popupMessage, setPopupMessage] = useState(""); // NEW: for errors & game over

  const startNewGame = async () => {
    const res = await API.post("/game/start");
    setGame(res.data);
    setCurrentGuess("");
    setKeyStates({});
    setPopupMessage(""); // reset popup when starting new game
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Physical keyboard handling
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

  // Handle guesses (from both keyboard and display buttons)
  const handleKeyPress = (key) => {
    if (!game || game.status !== "playing") return;

    if (key === "ENTER") {
      if (currentGuess.length === 5) submitGuess();
    } else if (key === "DEL") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  const submitGuess = async () => {
    if (!game) return;
    try {
      const res = await API.post("/game/guess", { gameId: game.id, guess: currentGuess });
      setGame(res.data);
      setCurrentGuess("");

      // Update key colors
      const newKeyStates = { ...keyStates };
      res.data.guesses.slice(-1)[0]?.feedback.forEach((f, i) => {
        const letter = res.data.guesses.slice(-1)[0].word[i].toUpperCase();
        if (f === "correct") newKeyStates[letter] = "correct";
        else if (f === "present" && newKeyStates[letter] !== "correct") newKeyStates[letter] = "present";
        else if (f === "absent" && !newKeyStates[letter]) newKeyStates[letter] = "absent";
      });
      setKeyStates(newKeyStates);

      if (res.data.status !== "playing" && onLeaderboardUpdate) {
        onLeaderboardUpdate();
        setPopupMessage(`Game Over! ${res.data.status.toUpperCase()} \nSolution: ${res.data.solution}`);
      }

    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Guess failed"); // show error in popup
    }
  };

  return (
    <div className="wl-game-container">
      {game ? (
        <>
          <Board 
            guesses={game.guesses} 
            maxAttempts={game.maxAttempts} 
            currentGuess={currentGuess} 
          />
          <Keyboard onKeyPress={handleKeyPress} keyStates={keyStates} />

          {/* Popup for both errors & game over */}
          {popupMessage && (
            <div className="wl-popup-overlay">
              <div className="wl-popup">
                <p className="wl-popup-text">{popupMessage}</p>
                <button onClick={() => popupMessage.includes("Game Over") ? startNewGame() : setPopupMessage("")}>
                  {popupMessage.includes("Game Over") ? "Play Again" : "Close"}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="wl-game-loading">Loading game...</p>
      )}
    </div>
  );
}
