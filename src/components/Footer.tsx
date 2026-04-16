import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-background border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-heading text-xl font-semibold text-foreground">Sable & Saffron</p>
          <p className="text-sm text-muted-foreground mt-1">Colour, quietly.</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <a href="mailto:hello@sableandsaffron.co.uk" className="hover:text-foreground transition-colors">Contact</a>
          <Link to="/returns" className="hover:text-foreground transition-colors">Returns</Link>
        </div>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          <Instagram size={20} />
        </a>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">© {new Date().getFullYear()} Sable & Saffron. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
