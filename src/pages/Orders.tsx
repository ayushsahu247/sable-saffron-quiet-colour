import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRow {
  id: string;
  created_at: string;
  subtotal: number;
  payment_status: string;
  status: string;
  items: OrderItem[];
}

interface ShipmentRow {
  order_id: string;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
}

const shipmentLabel = (status?: string) => {
  switch (status) {
    case "dispatched":
      return { label: "Dispatched", tone: "bg-accent/30 text-foreground" };
    case "delivered":
      return { label: "Delivered", tone: "bg-primary/20 text-foreground" };
    case "to_dispatch":
      return { label: "Preparing", tone: "bg-muted text-muted-foreground" };
    default:
      return { label: "Awaiting payment", tone: "bg-muted text-muted-foreground" };
  }
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [shipments, setShipments] = useState<Record<string, ShipmentRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    (async () => {
      setLoading(true);
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, created_at, subtotal, payment_status, status, items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const list = (orderData ?? []) as unknown as OrderRow[];
      setOrders(list);
      if (list.length) {
        const { data: shipData } = await supabase
          .from("shipments")
          .select("order_id, status, tracking_number, carrier, dispatched_at, delivered_at")
          .in("order_id", list.map((o) => o.id));
        const map: Record<string, ShipmentRow> = {};
        (shipData ?? []).forEach((s) => {
          map[s.order_id] = s as ShipmentRow;
        });
        setShipments(map);
      }
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="font-heading text-4xl text-foreground mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-8">Review your previous purchases and delivery status.</p>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/shop">Browse the collection</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const ship = shipments[o.id];
            const tag = o.payment_status !== "paid" ? { label: "Awaiting payment", tone: "bg-muted text-muted-foreground" } : shipmentLabel(ship?.status);
            return (
              <Card key={o.id}>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-lg font-heading">
                      Order #{o.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <Badge className={`${tag.tone} border-0 hover:${tag.tone}`}>{tag.label}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm divide-y divide-border">
                    {o.items.map((i, idx) => (
                      <li key={idx} className="flex justify-between py-2">
                        <span className="text-foreground">
                          {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
                        </span>
                        <span className="text-muted-foreground">£{(i.price * i.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-heading text-lg text-foreground">£{Number(o.subtotal).toFixed(2)}</span>
                  </div>
                  {ship?.tracking_number && (
                    <p className="text-xs text-muted-foreground">
                      Tracking: <span className="text-foreground">{ship.carrier ? `${ship.carrier} · ` : ""}{ship.tracking_number}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
