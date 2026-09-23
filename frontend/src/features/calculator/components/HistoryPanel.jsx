import { useEffect, useState } from "react";
import { clearHistory, fetchHistory } from "../services/calculator.api";

export default function HistoryPanel({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHistory()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]); // likely a guest session — no history to show
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleClear() {
    await clearHistory();
    setItems([]);
  }

  return (
    <div className="calc-history">
      {loading ? (
        <div className="calc-history__empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="calc-history__empty">No calculations saved yet.</div>
      ) : (
        <>
          {items.map((item) => (
            <div className="calc-history__item" key={item._id}>
              <span className="calc-history__expr">{item.expression}</span>
              <span className="calc-history__result">{item.result}</span>
            </div>
          ))}
          <button type="button" className="calc-history__clear" onClick={handleClear}>
            Clear history
          </button>
        </>
      )}
    </div>
  );
}
