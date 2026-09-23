import { useEffect, useRef, useState } from "react";
import { fetchGraphData } from "../services/calculator.api";

function drawGraph(canvas, points, xMin, xMax) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const finite = points.filter((p) => p.y !== null);
  if (!finite.length) return;

  const yMin = Math.min(...finite.map((p) => p.y));
  const yMax = Math.max(...finite.map((p) => p.y));
  const yPad = (yMax - yMin || 1) * 0.1;
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;

  const toPx = (x, y) => {
    const px = ((x - xMin) / (xMax - xMin)) * width;
    const py = height - ((y - yLo) / (yHi - yLo || 1)) * height;
    return [px, py];
  };

  // axes
  ctx.strokeStyle = "#33364066";
  ctx.lineWidth = 1;
  if (yLo < 0 && yHi > 0) {
    const [, zy] = toPx(0, 0);
    ctx.beginPath();
    ctx.moveTo(0, zy);
    ctx.lineTo(width, zy);
    ctx.stroke();
  }
  if (xMin < 0 && xMax > 0) {
    const [zx] = toPx(0, 0);
    ctx.beginPath();
    ctx.moveTo(zx, 0);
    ctx.lineTo(zx, height);
    ctx.stroke();
  }

  // curve — drawn as separate segments so a null (undefined point,
  // e.g. a tan() asymptote) breaks the line instead of joining across it
  ctx.strokeStyle = "#5b9dff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let drawing = false;
  for (const p of points) {
    if (p.y === null) {
      drawing = false;
      continue;
    }
    const [px, py] = toPx(p.x, p.y);
    if (!drawing) {
      ctx.moveTo(px, py);
      drawing = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
}

export default function GraphPlotter() {
  const [expression, setExpression] = useState("sin(x)");
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);

  async function handlePlot() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGraphData({ expression, xMin: Number(xMin), xMax: Number(xMax), steps: 300 });
      pointsRef.current = data.points;
      if (canvasRef.current) drawGraph(canvasRef.current, data.points, Number(xMin), Number(xMax));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not plot expression");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handlePlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="calc-field-row">
        <span className="calc-label">f(x) =</span>
        <input
          className="calc-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          style={{ flex: 1, minWidth: 120 }}
          placeholder="e.g. x^2 - 3"
        />
      </div>
      <div className="calc-field-row">
        <span className="calc-label">Range</span>
        <input
          className="calc-input"
          type="number"
          value={xMin}
          onChange={(e) => setXMin(e.target.value)}
          style={{ width: 80 }}
        />
        <span>to</span>
        <input
          className="calc-input"
          type="number"
          value={xMax}
          onChange={(e) => setXMax(e.target.value)}
          style={{ width: 80 }}
        />
        <button type="button" className="calc-btn" onClick={handlePlot} disabled={loading}>
          {loading ? "Plotting…" : "Plot"}
        </button>
      </div>

      {error ? <div className="calc-error-text">{error}</div> : null}
      <canvas ref={canvasRef} width={480} height={220} className="calc-graph-canvas" />
    </div>
  );
}
