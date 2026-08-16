import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format";
import { updateUserProfile } from "@/services/user.service";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/profile/")({ component: ProfileDetails });

function ProfileDetails() {
  const { user, setUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ fullName: "", phone: "" });

  useEffect(() => {
    if (user) setDraft({ fullName: user.fullName, phone: user.phone ?? "" });
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateUserProfile({ fullName: draft.fullName, phone: draft.phone });
      setUser(updated);
      setEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <section>
      <h1 className="text-3xl">Profile</h1>
      <div className="surface-card mt-8 rounded-sm p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary font-serif text-2xl text-clay">
            {user.fullName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-serif text-xl">{user.fullName}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since {formatDate(user.createdAt)} · {user.role === "ADMIN" ? "Studio admin" : "Customer"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              disabled={!editing}
              value={draft.fullName}
              onChange={(event) => setDraft({ ...draft, fullName: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              disabled={!editing}
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-readonly">Email</Label>
            <Input id="email-readonly" disabled value={user.email} />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          {editing ? (
            <>
              <Button variant="clay" disabled={saving} onClick={() => void save()}>
                {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setDraft({ fullName: user.fullName, phone: user.phone ?? "" });
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="quiet" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}