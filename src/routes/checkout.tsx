import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequireAuth } from "@/components/guards/RouteGuards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/lib/format";
import { addAddress, getAddresses } from "@/services/user.service";
import { createOrder } from "@/services/order.service";
import { payWithRazorpay } from "@/services/payment.service";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/user";
import type { PaymentMethod } from "@/types/order";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "Checkout | Lippan Handcraft" },
      { name: "description", content: "Confirm your address, review your order and pay securely." },
      { property: "og:title", content: "Checkout | Lippan" },
      { property: "og:description", content: "Complete your Lippan order." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
});

const STEPS = ["Address", "Order summary", "Payment"] as const;

const EMPTY_ADDRESS = {
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

function CheckoutPage() {
  const { user, cart, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(EMPTY_ADDRESS);
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getAddresses(user.id).then((list) => {
      setAddresses(list);
      setSelected(list.find((address) => address.isDefault)?.id ?? list[0]?.id ?? "");
      setAdding(list.length === 0);
    });
  }, [user]);

  if (cart.items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-10">
          <EmptyState
            title="Nothing to check out yet"
            description="Your cart is empty. Discover something beautiful for your walls."
            actionLabel="Explore Collection"
            actionTo="/shop"
          />
        </div>
      </SiteLayout>
    );
  }

  const address = addresses.find((entry) => entry.id === selected);

  const saveAddress = async () => {
    if (!user) return;
    const list = await addAddress(user.id, { ...draft, isDefault: addresses.length === 0 });
    setAddresses(list);
    setSelected(list[list.length - 1]?.id ?? "");
    setAdding(false);
    setDraft(EMPTY_ADDRESS);
    toast.success("Address saved");
  };

  const placeOrder = async () => {
    if (!user || !address) return;
    setPlacing(true);
    try {
      if (method === "cod") {
        await createOrder(
          { items: cart.items.map(({ product, quantity }) => ({ product, quantity })), address, paymentMethod: "cod" },
          user,
        );
      } else {
        await payWithRazorpay(
          cart.items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
          address,
          user,
        );
      }
      await clearCart();
      toast.success("Order placed — thank you for supporting our artisans.");
      navigate({ to: "/profile/orders" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place the order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader eyebrow="Checkout" title="Three quiet steps" />

        <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10 lg:py-20">
          <ol className="mb-12 flex flex-wrap gap-x-8 gap-y-3">
            {STEPS.map((label, index) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full border text-xs",
                    index < step
                      ? "border-clay bg-clay text-clay-foreground"
                      : index === step
                        ? "border-clay text-clay"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {index < step ? <Check className="size-3.5" strokeWidth={2} /> : index + 1}
                </span>
                <span className={index === step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </li>
            ))}
          </ol>

          {step === 0 ? (
            <section className="space-y-6">
              {addresses.length > 0 ? (
                <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
                  {addresses.map((entry) => (
                    <label
                      key={entry.id}
                      className={cn(
                        "flex cursor-pointer gap-4 rounded-sm border p-5 text-sm transition-colors",
                        selected === entry.id ? "border-clay bg-clay/5" : "border-border hover:border-clay/50",
                      )}
                    >
                      <RadioGroupItem value={entry.id} className="mt-1" />
                      <span className="min-w-0">
                        <span className="block font-medium">{entry.fullName}</span>
                        <span className="mt-1 block text-muted-foreground">
                          {entry.house}, {entry.street}
                          {entry.landmark ? `, ${entry.landmark}` : ""} — {entry.city}, {entry.state}{" "}
                          {entry.pincode}, {entry.country}
                        </span>
                        <span className="mt-1 block text-muted-foreground">{entry.phone}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              ) : null}

              {adding ? (
                <div className="surface-card grid gap-5 rounded-sm p-6 sm:grid-cols-2">
                  {(
                    [
                      ["fullName", "Full name"],
                      ["phone", "Phone"],
                      ["house", "House / Flat"],
                      ["street", "Street"],
                      ["landmark", "Landmark"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "Pincode"],
                      ["country", "Country"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        value={draft[key]}
                        onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <Button variant="clay" onClick={() => void saveAddress()}>
                      Save address
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="quiet" onClick={() => setAdding(true)}>
                  Add a new address
                </Button>
              )}

              <div className="flex justify-end">
                <Button variant="clay" size="lg" disabled={!address} onClick={() => setStep(1)}>
                  Continue
                </Button>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="space-y-8">
              <ul className="divide-y divide-border border-y border-border">
                {cart.items.map((item) => (
                  <li key={item.product.id} className="flex items-center gap-4 py-4 text-sm">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="size-16 rounded-sm object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-base">{item.product.name}</span>
                      <span className="text-muted-foreground">Qty {item.quantity}</span>
                    </span>
                    <span>{formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <dl className="ml-auto max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <dt className="font-serif text-lg">Total</dt>
                  <dd className="font-serif text-xl">{formatPrice(cart.total)}</dd>
                </div>
              </dl>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button variant="clay" size="lg" onClick={() => setStep(2)}>
                  Continue to payment
                </Button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-8">
              <RadioGroup
                value={method}
                onValueChange={(value) => setMethod(value as PaymentMethod)}
                className="space-y-3"
              >
                {(
                  [
                    ["razorpay", "Pay online", "UPI, cards, netbanking via Razorpay."],
                    ["cod", "Cash on Delivery", "Pay the courier when your artwork arrives."],
                  ] as const
                ).map(([value, label, hint]) => (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer gap-4 rounded-sm border p-5 text-sm transition-colors",
                      method === value ? "border-clay bg-clay/5" : "border-border hover:border-clay/50",
                    )}
                  >
                    <RadioGroupItem value={value} className="mt-1" />
                    <span>
                      <span className="block font-medium">{label}</span>
                      <span className="mt-1 block text-muted-foreground">{hint}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>

              <p className="text-xs text-muted-foreground">
                Payments run through a server-side gateway — no keys or secrets are held in the browser.
              </p>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="clay" size="lg" disabled={placing} onClick={() => void placeOrder()}>
                  {placing ? <Loader2 className="animate-spin" /> : `Pay ${formatPrice(cart.total)}`}
                </Button>
              </div>
            </section>
          ) : null}

          <p className="mt-12 text-xs text-muted-foreground">
            Need help? <Link to="/contact" className="text-clay hover:underline">Write to the studio</Link>.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
