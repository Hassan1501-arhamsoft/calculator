const SCIENTIFIC_KEYS = [
  { label: "sin", token: "sin(" },
  { label: "cos", token: "cos(" },
  { label: "tan", token: "tan(" },
  { label: "log", token: "log10(" },
  { label: "ln", token: "log(" },
  { label: "√", token: "sqrt(" },
  { label: "x²", token: "^2" },
  { label: "xʸ", token: "^" },
  { label: "π", token: "pi" },
  { label: "e", token: "e" },
  { label: "n!", token: "!" },
  { label: "1/x", token: "^-1" },
];

export default function Keypad({ onKey, showScientific }) {
  return (
    <div>
      {showScientific ? (
        <div className="calc-grid" style={{ marginBottom: 8 }}>
          {SCIENTIFIC_KEYS.map((k) => (
            <button
              key={k.label}
              type="button"
              className="calc-key calc-key--fn"
              onClick={() => onKey({ type: "append", value: k.token })}
            >
              {k.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="calc-grid">
        <button type="button" className="calc-key calc-key--clear" onClick={() => onKey({ type: "clear" })}>
          AC
        </button>
        <button type="button" className="calc-key" onClick={() => onKey({ type: "append", value: "(" })}>
          (
        </button>
        <button type="button" className="calc-key" onClick={() => onKey({ type: "append", value: ")" })}>
          )
        </button>
        <button type="button" className="calc-key calc-key--op" onClick={() => onKey({ type: "append", value: "/" })}>
          ÷
        </button>

        {["7", "8", "9"].map((d) => (
          <button key={d} type="button" className="calc-key" onClick={() => onKey({ type: "append", value: d })}>
            {d}
          </button>
        ))}
        <button type="button" className="calc-key calc-key--op" onClick={() => onKey({ type: "append", value: "*" })}>
          ×
        </button>

        {["4", "5", "6"].map((d) => (
          <button key={d} type="button" className="calc-key" onClick={() => onKey({ type: "append", value: d })}>
            {d}
          </button>
        ))}
        <button type="button" className="calc-key calc-key--op" onClick={() => onKey({ type: "append", value: "-" })}>
          −
        </button>

        {["1", "2", "3"].map((d) => (
          <button key={d} type="button" className="calc-key" onClick={() => onKey({ type: "append", value: d })}>
            {d}
          </button>
        ))}
        <button type="button" className="calc-key calc-key--op" onClick={() => onKey({ type: "append", value: "+" })}>
          +
        </button>

        <button type="button" className="calc-key" onClick={() => onKey({ type: "append", value: "0" })}>
          0
        </button>
        <button type="button" className="calc-key" onClick={() => onKey({ type: "append", value: "." })}>
          .
        </button>
        <button type="button" className="calc-key" onClick={() => onKey({ type: "backspace" })}>
          ⌫
        </button>
        <button type="button" className="calc-key calc-key--equals" onClick={() => onKey({ type: "evaluate" })}>
          =
        </button>
      </div>
    </div>
  );
}
