import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { IndianRupee, Package, ShoppingBag, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { getAdminStats } from "@/services/admin.service";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "stats"], queryFn: getAdminStats });

  if (isLoading || !data) {
    return (
      <section>
        <h1 className="text-3xl">Overview</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-sm" />
          ))}
        </div>
      </section>
    );
  }

  const cards = [
    { label: "Total revenue", value: formatPrice(data.totalRevenue), icon: IndianRupee },
    { label: "Orders", value: String(data.totalOrders), icon: ShoppingBag },
    { label: "Products", value: String(data.totalProducts), icon: Package },
    { label: "Customers", value: String(data.totalCustomers), icon: Users },
  ];

  return (
    <section>
      <h1 className="text-3xl">Overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="surface-card rounded-sm p-6">
            <card.icon className="size-5 text-clay" strokeWidth={1.5} />
            <p className="mt-4 font-serif text-2xl">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="surface-card rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Pending fulfilment</p>
          <p className="mt-2 font-serif text-3xl">{data.pendingOrders}</p>
        </div>
        <div className="surface-card rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="mt-2 font-serif text-3xl">{data.deliveredOrders}</p>
        </div>
      </div>

      {data.revenueByMonth.length > 0 ? (
        <div className="surface-card mt-8 rounded-sm p-6">
          <p className="text-eyebrow mb-6">Revenue by month</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(value: number) => formatPrice(value)} />
                <Bar dataKey="revenue" fill="var(--clay)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
