import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavouritesProvider } from "@/context/FavouritesContext";
import Auth from "./pages/Auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSlideout from "@/components/CartSlideout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Favourites from "./pages/Favourites";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import About from "./pages/About";
import Returns from "./pages/Returns";
import Unsubscribe from "./pages/Unsubscribe";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <AuthProvider>
          <CartProvider>
            <FavouritesProvider>
              <Toaster />
              <Sonner />
              <Navbar />
              <CartSlideout />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/about" element={<About />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </FavouritesProvider>
          </CartProvider>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
