/**
 * Small shared loading indicator. Lives at the app level (not inside
 * features/calculator/) because it's generic enough for any feature to
 * reuse — matching the reference project's top-level components/ folder.
 */
export default function Loader({ label = "Loading…" }) {
  return (
    <span style={{ fontSize: 13, color: "#8b909c", fontFamily: "Inter, system-ui, sans-serif" }}>
      {label}
    </span>
  );
}
