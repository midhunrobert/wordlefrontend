import './Board.css'

export default function Board({ guesses, maxAttempts, currentGuess }) {
  const rows = [];

  for (let i = 0; i < maxAttempts; i++) {
    let guess = guesses[i];
    // If this row is the next empty row, show currentGuess
    if (!guess && i === guesses.length) {
      guess = { word: currentGuess, feedback: Array(currentGuess.length).fill("") };
    }

    rows.push(
      <div key={i} className="row">
        {Array(5).fill("").map((_, j) => {
          const letter = guess?.word[j] || "";
          const feedback = guess?.feedback[j] || "";
          return (
            <span key={j} className={`cell ${feedback}`}>{letter.toUpperCase()}</span>
          );
        })}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}
