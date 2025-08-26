const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function Keyboard({ onKeyPress }) {
  return (
    <div className="keyboard">
      {KEYS.map((k) => (
        <button key={k} onClick={() => onKeyPress(k)}>{k}</button>
      ))}
      <button onClick={() => onKeyPress("ENTER")}>ENTER</button>
      <button onClick={() => onKeyPress("DEL")}>DEL</button>
    </div>
  );
}
