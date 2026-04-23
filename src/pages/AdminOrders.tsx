import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  subtotal: number;
  payment_status: string;
  items: OrderItem[];
}

interface ShipmentRow {
  id: string;
  order_id: string;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
}

const SHIPMENT_STATUSES = [
  { value: "to_dispatch", label: "To dispatch" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
];

const AdminOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [shipments, setShipments] = useState<Record<string, ShipmentRow>>({});
  const [drafts, setDrafts] = useState<Record<string, { status: string; tracking_number: string; carrier: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      navigate("/");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, authLoading, roleLoading]);

  const load = async () => {
    setLoading(true);
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load orders");
      setLoading(false);
      return;
    }
    const list = (orderData ?? []) as unknown as OrderRow[];
    setOrders(list);

    if (list.length) {
      const { data: shipData } = await supabase
        .from("shipments")
        .select("id, order_id, status, tracking_number, carrier")
        .in("order_id", list.map((o) => o.id));
      const map: Record<string, ShipmentRow> = {};
      const draftMap: Record<string, { status: string; tracking_number: string; carrier: string }> = {};
      (shipData ?? []).forEach((s) => {
        map[s.order_id] = s as ShipmentRow;
        draftMap[s.order_id] = {
          status: s.status,
          tracking_number: s.tracking_number ?? "",
          carrier: s.carrier ?? "",
        };
      });
      list.forEach((o) => {
        if (!draftMap[o.id]) {
          draftMap[o.id] = { status: "to_dispatch", tracking_number: "", carrier: "" };
        }
      });
      setShipments(map);
      setDrafts(draftMap);
    }
    setLoading(false);
  };

  const saveShipment = async (orderId: string) => {
    const draft = drafts[orderId];
    if (!draft) return;
    setSaving(orderId);

    const existing = shipments[orderId];
    const now = new Date().toISOString();
    const updates: Partial<{
      status: string;
      tracking_number: string | null;
      carrier: string | null;
      dispatched_at: string;
      delivered_at: string;
    }> = {
      status: draft.status,
      tracking_number: draft.tracking_number || null,
      carrier: draft.carrier || null,
    };
    if (draft.status === "dispatched") updates.dispatched_at = now;
    if (draft.status === "delivered") updates.delivered_at = now;

    if (existing) {
      const { error } = await supabase.from("shipments").update(updates).eq("id", existing.id);
      if (error) {
        toast.error("Failed to update");
        setSaving(null);
        return;
      }
    } else {
      const { error } = await supabase.from("shipments").insert({ order_id: orderId, ...updates });
      if (error) {
        toast.error("Failed to create shipment");
        setSaving(null);
        return;
      }
    }
    toast.success("Order updated");
    setSaving(null);
    void load();
  };

  if (authLoading || roleLoading || loading) {
    return <div className="container mx-auto px-6 py-12">Loading…</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <h1 className="font-heading text-4xl text-foreground mb-2">Admin · Orders</h1>
      <p className="text-muted-foreground mb-8">Mark orders as dispatched or delivered, and add tracking details.</p>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No paid orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const draft = drafts[o.id] ?? { status: "to_dispatch", tracking_number: "", carrier: "" };
            return (
              <Card key={o.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-lg text-foreground">
                        #{o.id.slice(0, 8).toUpperCase()} · {o.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("en-GB")} · {o.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {o.address_line1}{o.address_line2 ? `, ${o.address_line2}` : ""}, {o.city} {o.postcode}
                      </p>
                    </div>
                    <Badge variant="secondary">£{Number(o.subtotal).toFixed(2)}</Badge>
                  </div>

                  <ul className="text-sm divide-y divide-border border-y border-border">
                    {o.items.map((i, idx) => (
                      <li key={idx} className="flex justify-between py-2">
                        <span>{i.name} × {i.quantity}</span>
                        <span className="text-muted-foreground">£{(i.price * i.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid gap-3 md:grid-cols-4 items-end">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                      <Select
                        value={draft.status}
                        onValueChange={(v) => setDrafts((d) => ({ ...d, [o.id]: { ...draft, status: v } }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SHIPMENT_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Carrier</label>
                      <Input
                        value={draft.carrier}
                        onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: { ...draft, carrier: e.target.value } }))}
                        placeholder="Royal Mail"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Tracking #</label>
                      <Input
                        value={draft.tracking_number}
                        onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: { ...draft, tracking_number: e.target.value } }))}
                        placeholder="ABC123…"
                      />
                    </div>
                    <Button onClick={() => saveShipment(o.id)} disabled={saving === o.id}>
                      {saving === o.id ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
