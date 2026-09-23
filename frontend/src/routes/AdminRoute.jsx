/**
 * Reserved for admin-only routes once this project has roles (e.g. an
 * admin view of every device's history). No auth yet, so this just
 * renders its children unchanged. Named/placed to match the reference
 * project's routes/ folder.
 */
export default function AdminRoute({ children }) {
  return children;
}
