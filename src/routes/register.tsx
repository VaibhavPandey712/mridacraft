import { createFileRoute, Navigate } from "@tanstack/react-router";

// There is no separate registration flow — signing in with Google on the
// login page creates the account automatically the first time. Keep this
// route around so any old bookmarks/links to /register still work.
export const Route = createFileRoute("/register")({
  component: () => <Navigate to="/login" replace />,
});
