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
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground transition-colors py-2">Shop</Link>
          <Link to="/about" className="hover:text-foreground transition-colors py-2">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors py-2">Contact</Link>
          <Link to="/returns" className="hover:text-foreground transition-colors py-2">Returns</Link>
        </nav>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sable & Saffron on Instagram"
          className="text-muted-foreground hover:text-foreground transition-colors min-w-11 min-h-11 inline-flex items-center justify-center"
        >
          <Instagram size={20} />
        </a>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">© {new Date().getFullYear()} Sable & Saffron. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
