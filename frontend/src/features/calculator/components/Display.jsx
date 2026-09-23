export default function Display({ expression, result, error, placeholder = "0" }) {
  return (
    <div className="calc-display">
      {expression ? <div className="calc-display__trail">{expression}</div> : null}
      {error ? (
        <div className="calc-display__value calc-display__value--error">{error}</div>
      ) : (
        <div className="calc-display__value">
          {result !== null && result !== undefined ? result : expression || placeholder}
        </div>
      )}
    </div>
  );
}
