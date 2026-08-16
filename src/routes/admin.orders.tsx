import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/format";
import { getAllOrders, updateOrderStatus } from "@/services/admin.service";
import { DELIVERY_STATUSES, type DeliveryStatus } from "@/types/order";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: getAllOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) => updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update order"),
  });

  return (
    <section>
      <h1 className="text-3xl">Orders</h1>

      <div className="surface-card mt-8 overflow-hidden rounded-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders ?? []).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(-8)}</TableCell>
                  <TableCell>
                    <span className="block">{order.customerName}</span>
                    <span className="block text-xs text-muted-foreground">{order.customerEmail}</span>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.paymentMethod.toUpperCase()} · {order.paymentStatus}
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.deliveryStatus}
                      onValueChange={(value) =>
                        statusMutation.mutate({ id: order.id, status: value as DeliveryStatus })
                      }
                    >
                      <SelectTrigger className="h-9 w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
