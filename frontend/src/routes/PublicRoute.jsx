/**
 * Reserved for pages that should redirect away an already-logged-in
 * user (e.g. a /login page). No auth yet, so this just renders its
 * children unchanged. Named/placed to match the reference project's
 * routes/ folder.
 */
export default function PublicRoute({ children }) {
  return children;
}
