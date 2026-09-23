import { useCallback, useState } from "react";
import { evaluateExpression } from "../services/calculator.api";

/**
 * Builds up an expression string as the user taps keys, then sends it
 * to the backend on "=" (mathjs there does the actual evaluation, so
 * the frontend never needs its own parser).
 */
export function useCalculator({ onEvaluated } = {}) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const append = useCallback((token) => {
    setError(null);
    setExpression((prev) => prev + token);
  }, []);

  const backspace = useCallback(() => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setExpression("");
    setResult(null);
    setError(null);
  }, []);

  const evaluate = useCallback(async () => {
    if (!expression.trim()) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const data = await evaluateExpression(expression);
      setResult(data.result);
      onEvaluated?.(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not evaluate");
    } finally {
      setIsEvaluating(false);
    }
  }, [expression, onEvaluated]);

  return {
    expression,
    result,
    error,
    isEvaluating,
    append,
    backspace,
    clear,
    setExpression,
    evaluate
  };
}
