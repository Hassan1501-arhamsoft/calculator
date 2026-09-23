import { useState } from "react";
import { convertUnit } from "../services/calculator.api";

const CATEGORIES = {
  length: { units: ["mm", "cm", "m", "km", "in", "ft", "mi"], default: ["m", "ft"] },
  mass: { units: ["mg", "g", "kg", "oz", "lb"], default: ["kg", "lb"] },
  temperature: { units: ["C", "F", "K"], default: ["C", "F"] },
  area: { units: ["m^2", "km^2", "ft^2", "acre"], default: ["m^2", "ft^2"] },
  volume: { units: ["ml", "l", "m^3", "gal", "cup"], default: ["l", "gal"] },
  time: { units: ["s", "min", "h", "day"], default: ["min", "s"] },
  speed: { units: ["m/s", "km/h", "mph", "knot"], default: ["km/h", "mph"] },
  data: { units: ["bytes", "kB", "MB", "GB", "TB"], default: ["MB", "GB"] },
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [from, setFrom] = useState(CATEGORIES.length.default[0]);
  const [to, setTo] = useState(CATEGORIES.length.default[1]);
  const [value, setValue] = useState("1");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleCategoryChange(next) {
    setCategory(next);
    setFrom(CATEGORIES[next].default[0]);
    setTo(CATEGORIES[next].default[1]);
    setResult(null);
  }

  async function handleConvert() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await convertUnit({ category, from, to, value: Number(value) });
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not convert");
    } finally {
      setLoading(false);
    }
  }

  const units = CATEGORIES[category].units;

  return (
    <div>
      <div className="calc-field-row">
        <span className="calc-label">Category</span>
        <select className="calc-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          {Object.keys(CATEGORIES).map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="calc-field-row">
        <input
          className="calc-input"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 110 }}
        />
        <select className="calc-select" value={from} onChange={(e) => setFrom(e.target.value)}>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <span className="calc-label" style={{ minWidth: "auto" }}>
          →
        </span>
        <select className="calc-select" value={to} onChange={(e) => setTo(e.target.value)}>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="calc-btn" onClick={handleConvert} disabled={loading}>
        {loading ? "Converting…" : "Convert"}
      </button>

      {error ? <div className="calc-error-text">{error}</div> : null}
      {result !== null ? (
        <div className="calc-result-box">
          {value} {from} = {Number(result).toFixed(6).replace(/\.?0+$/, "")} {to}
        </div>
      ) : null}
    </div>
  );
}
