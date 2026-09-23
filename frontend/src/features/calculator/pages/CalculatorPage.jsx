import { useState } from "react";
import "../calculator.css";
import Display from "../components/Display";
import Keypad from "../components/Keypad";
import MatrixCalculator from "../components/MatrixCalculator";
import UnitConverter from "../components/UnitConverter";
import GraphPlotter from "../components/GraphPlotter";
import HistoryPanel from "../components/HistoryPanel";
import { useCalculator } from "../hooks/useCalculator";

// Added professional contextual descriptions for each mode
const TABS = [
  { id: "basic", label: "Basic", desc: "Standard arithmetic & sequential operations" },
  { id: "scientific", label: "Scientific", desc: "Advanced mathematical & trigonometric functions" },
  { id: "matrix", label: "Matrix", desc: "Linear algebra & multi-dimensional computations" },
  { id: "convert", label: "Convert", desc: "Physical unit & dimensional transformations" },
  { id: "graph", label: "Graph", desc: "2D function plotting & spatial visualization" },
];

export default function CalculatorPage() {
  const [tab, setTab] = useState("basic");
  const [showHistory, setShowHistory] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const calc = useCalculator({
    onEvaluated: () => setHistoryRefresh((n) => n + 1),
  });

  function handleKey(action) {
    if (action.type === "append") calc.append(action.value);
    else if (action.type === "backspace") calc.backspace();
    else if (action.type === "clear") calc.clear();
    else if (action.type === "evaluate") calc.evaluate();
  }

  return (
    <div className="calc-suite">
      {/* Enhanced Professional Header */}
      <div className="calc-suite__header">
        <div className="calc-suite__brand">
          <span className="calc-suite__title">CALCULATOR CORE SUITE</span>
          <span className="calc-suite__version">v2.0.4</span>
        </div>
        <button
          type="button"
          className="calc-suite__history-toggle"
          onClick={() => setShowHistory((s) => !s)}
        >
          {showHistory ? "SYSTEM LOGS: HIDE" : "SYSTEM LOGS: VIEW"}
        </button>
      </div>

      <div className="calc-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className="calc-tabs__item"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic Contextual Description */}
      <div className="calc-suite__meta">
        <span className="calc-suite__mode-desc">
          {TABS.find((t) => t.id === tab)?.desc}
        </span>
      </div>

      {(tab === "basic" || tab === "scientific") && (
        <>
          <Display expression={calc.expression} result={calc.result} error={calc.error} />
          <Keypad onKey={handleKey} showScientific={tab === "scientific"} />
        </>
      )}

      {tab === "matrix" && <MatrixCalculator />}
      {tab === "convert" && <UnitConverter />}
      {tab === "graph" && <GraphPlotter />}

      {showHistory ? <HistoryPanel refreshKey={historyRefresh} /> : null}

      {/* Professional System Footer */}
      <div className="calc-suite__footer">
        <div className="calc-status">
          <span className="calc-status__dot"></span>
          SERVER: ONLINE
        </div>
        <div className="calc-credit">ENG: HASSAN</div>
      </div>
    </div>
  );
}