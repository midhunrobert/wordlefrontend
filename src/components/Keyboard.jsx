import './Keyboard.css'

const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function Keyboard({ onKeyPress, keyStates = {} }) {
  return (
    <div className="keyboard">
      {KEYS.map((k) => (
        <button
          key={k}
          className={`key ${keyStates[k] || ""}`}
          onClick={() => onKeyPress(k)}
        >
          {k}
        </button>
      ))}
      <button className="key special" onClick={() => onKeyPress("ENTER")}>ENTER</button>
      <button className="key special" onClick={() => onKeyPress("DEL")}>DEL</button>
    </div>
  );
}
