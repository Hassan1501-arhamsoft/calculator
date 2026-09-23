import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <main style={{ padding: "48px 16px" }}>
        <AppRoutes />
      </main>
    </AppProvider>
  );
}
