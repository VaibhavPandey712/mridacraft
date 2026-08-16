import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/services/user.service";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/user";

export const Route = createFileRoute("/profile/addresses")({ component: AddressesPage });

const FIELDS = [
  ["fullName", "Full name"],
  ["phone", "Phone"],
  ["house", "House / Flat"],
  ["street", "Street"],
  ["landmark", "Landmark"],
  ["city", "City"],
  ["state", "State"],
  ["pincode", "Pincode"],
  ["country", "Country"],
] as const;

const EMPTY = {
  fullName: "",
  phone: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

function AddressesPage() {
  const { user } = useApp();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) void getAddresses(user.id).then(setAddresses);
  }, [user]);

  const submit = async () => {
    if (!user) return;
    if (editingId) {
      setAddresses(await updateAddress(user.id, editingId, draft));
      toast.success("Address updated");
    } else {
      setAddresses(await addAddress(user.id, draft));
      toast.success("Address added");
    }
    setDraft(EMPTY);
    setEditingId(null);
    setOpen(false);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Addresses</h1>
        <Button
          variant="clay"
          onClick={() => {
            setDraft(EMPTY);
            setEditingId(null);
            setOpen(true);
          }}
        >
          Add address
        </Button>
      </div>

      {addresses.length === 0 && !open ? (
        <div className="mt-8">
          <EmptyState icon={MapPin} title="No saved addresses" description="Add one to speed up checkout." />
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={cn(
              "rounded-sm border p-5 text-sm",
              address.isDefault ? "border-clay bg-clay/5" : "border-border",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{address.fullName}</p>
              {address.isDefault ? (
                <span className="text-[10px] uppercase tracking-[0.16em] text-clay">Default</span>
              ) : null}
            </div>
            <p className="mt-2 text-muted-foreground">
              {address.house}, {address.street}
              {address.landmark ? `, ${address.landmark}` : ""}
              <br />
              {address.city}, {address.state} {address.pincode}, {address.country}
            </p>
            <p className="mt-1 text-muted-foreground">{address.phone}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="quiet"
                onClick={() => {
                  setDraft({ ...EMPTY, ...address, landmark: address.landmark ?? "" });
                  setEditingId(address.id);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              {!address.isDefault ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => user && setAddresses(await setDefaultAddress(user.id, address.id))}
                >
                  Set default
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={async () => user && setAddresses(await deleteAddress(user.id, address.id))}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {open ? (
        <div className="surface-card mt-8 grid gap-5 rounded-sm p-6 sm:grid-cols-2">
          {FIELDS.map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`addr-${key}`}>{label}</Label>
              <Input
                id={`addr-${key}`}
                value={draft[key]}
                onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
              />
            </div>
          ))}
          <div className="flex gap-3 sm:col-span-2">
            <Button variant="clay" onClick={() => void submit()}>
              {editingId ? "Save changes" : "Save address"}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}