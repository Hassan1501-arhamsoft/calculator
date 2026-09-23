import { createContext, useContext } from "react";
import { useCalculator } from "../hooks/useCalculator";

// Feature-scoped context — mirrors the pattern of features/auth/context
// in the wider project. CalculatorPage provides it; the Display and
// Keypad could consume it via useCalculatorContext() instead of props
// if the tree grows deeper. Kept optional: components currently still
// take props directly, so this is here for that future growth.
const CalculatorContext = createContext(null);

export function CalculatorProvider({ children, onEvaluated }) {
  const calc = useCalculator({ onEvaluated });
  return <CalculatorContext.Provider value={calc}>{children}</CalculatorContext.Provider>;
}

export function useCalculatorContext() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculatorContext must be used within CalculatorProvider");
  return ctx;
}
