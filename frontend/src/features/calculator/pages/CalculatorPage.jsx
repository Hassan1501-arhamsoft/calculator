import { useState } from "react";
import "../calculator.css";
import Display from "../components/Display";
import Keypad from "../components/Keypad";
import MatrixCalculator from "../components/MatrixCalculator";
import UnitConverter from "../components/UnitConverter";
import GraphPlotter from "../components/GraphPlotter";
import HistoryPanel from "../components/HistoryPanel";
import { useCalculator } from "../hooks/useCalculator";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "scientific", label: "Scientific" },
  { id: "matrix", label: "Matrix" },
  { id: "convert", label: "Convert" },
  { id: "graph", label: "Graph" },
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
      <div className="calc-suite__header">
        <span className="calc-suite__title">Calculator Suite</span>
        <button
          type="button"
          className="calc-suite__history-toggle"
          onClick={() => setShowHistory((s) => !s)}
        >
          {showHistory ? "Hide history" : "History"}
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
    </div>
  );
}
