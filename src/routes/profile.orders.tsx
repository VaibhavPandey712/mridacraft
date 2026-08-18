import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { formatDate, formatPrice } from "@/lib/format";
import { getOrders } from "@/services/order.service";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/profile/orders")({ component: OrdersPage });

function OrdersPage() {
  const { user } = useApp();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(user!.id),
    enabled: Boolean(user),
  });

  return (
    <section>
      <h1 className="text-3xl">My orders</h1>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-sm" />
          ))}
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you order an artwork, its journey will appear here."
            actionLabel="Explore Collection"
            actionTo="/shop"
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {data?.map((order) => (
            <li key={order.id} className="surface-card rounded-sm p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="min-w-0">
                  <p className="font-serif text-lg">{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">
                    Placed {formatDate(order.createdAt)} · Payment {order.paymentStatus} ·{" "}
                    {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <p className="font-serif text-xl sm:text-right">{formatPrice(order.total)}</p>
              </div>

              <ul className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      width={56}
                      height={56}
                      className="size-14 rounded-sm object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate">{item.name}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-6">
                <OrderTimeline status={order.deliveryStatus} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}