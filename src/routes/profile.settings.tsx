import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/profile/settings")({ component: SettingsPage });

function SettingsPage() {
  const { logout } = useApp();
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="text-3xl">Settings</h1>
      <div className="surface-card mt-8 divide-y divide-border rounded-sm">
        {[
          { label: "Order updates by email", hint: "Dispatch, delivery and studio notes." },
          { label: "New collection announcements", hint: "" },
          { label: "Artisan stories", hint: "Occasional letters from the workshop." },
        ].map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-6 p-6">
            <div className="min-w-0">
              <p className="text-sm">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </div>
            <Switch defaultChecked={index === 0} />
          </div>
        ))}
      </div>

      {/* <div className="mt-8">
        <Button
          variant="quiet"
          onClick={() => {
            void logout();
            navigate({ to: "/" });
          }}
        >
          Log out of this device
        </Button>
      </div> */}
    </section>
  );
}