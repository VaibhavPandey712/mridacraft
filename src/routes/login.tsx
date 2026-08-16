import { createFileRoute } from "@tanstack/react-router";

import { AuthShell, GoogleButton } from "@/components/auth/AuthShell";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Log in | Lippen Handcraft Studio" },
      { name: "description", content: "Sign in to track orders, save artworks and manage addresses." },
      { property: "og:title", content: "Log in | Lippen" },
      { property: "og:description", content: "Access your Lippen account." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function LoginPage() {
  const { loginWithGoogle } = useApp();

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with Google to follow your orders and saved artworks.">
      <div className="space-y-6">
        <GoogleButton onClick={() => loginWithGoogle("/profile")} />
        <p className="text-center text-xs text-muted-foreground">
          We only use Google Sign-In — no passwords to remember, and your account is created
          automatically on your first sign-in.
        </p>
      </div>
    </AuthShell>
  );
}
