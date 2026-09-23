import { createContext, useContext, useMemo } from "react";
import { getDeviceId } from "../utils/deviceId";

// App-wide context (as opposed to a feature-level context like
// features/calculator/context/CalculatorContext.jsx). Currently just
// exposes the device id so any feature can read it without importing
// the util directly — a natural place to add app-wide settings
// (theme, locale, etc.) as the project grows.
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const value = useMemo(() => ({ deviceId: getDeviceId() }), []);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
