import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const CartSlideout = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl font-semibold">Your Cart</h2>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded-lg" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-heading text-sm font-medium">{item.product.name}</h3>
                  <p className="text-sm text-foreground">£{item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-foreground self-start">
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">£{subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-accent text-accent-foreground text-center py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSlideout;
