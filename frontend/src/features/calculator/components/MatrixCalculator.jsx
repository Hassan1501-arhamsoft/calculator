import { useState } from "react";
import { runMatrixOperation } from "../services/calculator.api";

const OPERATIONS = [
  { value: "add", label: "A + B", needsB: true },
  { value: "subtract", label: "A − B", needsB: true },
  { value: "multiply", label: "A × B", needsB: true },
  { value: "transpose", label: "Aᵀ", needsB: false },
  { value: "determinant", label: "det(A)", needsB: false },
  { value: "inverse", label: "A⁻¹", needsB: false },
];

function emptyMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function MatrixInput({ label, matrix, onChange }) {
  return (
    <div>
      <div className="calc-label" style={{ marginBottom: 4 }}>
        {label}
      </div>
      <div
        className="calc-matrix-grid"
        style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, auto)` }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <input
              key={`${r}-${c}`}
              className="calc-input"
              type="number"
              value={val}
              onChange={(e) => {
                const next = matrix.map((row2) => [...row2]);
                next[r][c] = Number(e.target.value);
                onChange(next);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function MatrixCalculator() {
  const [operation, setOperation] = useState("add");
  const [dims, setDims] = useState({ rows: 2, cols: 2 });
  const [matrixA, setMatrixA] = useState(emptyMatrix(2, 2));
  const [matrixB, setMatrixB] = useState(emptyMatrix(2, 2));
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const opDef = OPERATIONS.find((o) => o.value === operation);

  function resize(rows, cols) {
    setDims({ rows, cols });
    setMatrixA(emptyMatrix(rows, cols));
    setMatrixB(emptyMatrix(rows, cols));
    setResult(null);
  }

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runMatrixOperation({
        operation,
        matrixA,
        matrixB: opDef.needsB ? matrixB : undefined,
      });
      setResult(data.resultDisplay);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not calculate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="calc-field-row">
        <span className="calc-label">Operation</span>
        <select className="calc-select" value={operation} onChange={(e) => setOperation(e.target.value)}>
          {OPERATIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="calc-field-row">
        <span className="calc-label">Size</span>
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            className="calc-btn calc-btn--ghost"
            onClick={() => resize(n, n)}
            style={{ padding: "6px 12px" }}
          >
            {n}×{n}
          </button>
        ))}
      </div>

      <div className="calc-field-row" style={{ alignItems: "flex-start" }}>
        <MatrixInput label="Matrix A" matrix={matrixA} onChange={setMatrixA} />
        {opDef.needsB ? <MatrixInput label="Matrix B" matrix={matrixB} onChange={setMatrixB} /> : null}
      </div>

      <button type="button" className="calc-btn" onClick={handleCalculate} disabled={loading}>
        {loading ? "Calculating…" : "Calculate"}
      </button>

      {error ? <div className="calc-error-text">{error}</div> : null}
      {result ? <div className="calc-result-box">{result}</div> : null}
    </div>
  );
}
