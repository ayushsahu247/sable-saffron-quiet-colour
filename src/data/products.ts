import scarf1 from "@/assets/products/scarf-1.jpg";
import scarf2 from "@/assets/products/scarf-2.jpg";
import scarf3 from "@/assets/products/scarf-3.jpg";
import scarf4 from "@/assets/products/scarf-4.jpg";
import scarf5 from "@/assets/products/scarf-5.jpg";
import scarf6 from "@/assets/products/scarf-6.jpg";

export type ProductWeight = "lightweight" | "heavy-winter";

export interface Product {
  id: string;
  name: string;
  weight: ProductWeight;
  price: number;
  originalPrice?: number;
  image: string;
  inHighDemand: boolean;
  colourRef: string;
}

export const products: Product[] = [
  {
    id: "soft-terracotta-bloom",
    name: "Soft Terracotta Bloom",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf1,
    inHighDemand: true,
    colourRef: "soft terracotta",
  },
  {
    id: "sage-blossom",
    name: "Sage Blossom",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf2,
    inHighDemand: false,
    colourRef: "dusty sage and blush",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    weight: "lightweight",
    price: 12.99,
    image: scarf3,
    inHighDemand: false,
    colourRef: "soft lavender",
  },
  {
    id: "burgundy-paisley",
    name: "Burgundy Paisley",
    weight: "heavy-winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf4,
    inHighDemand: true,
    colourRef: "rich burgundy and camel",
  },
  {
    id: "navy-rose-weave",
    name: "Navy & Rose Weave",
    weight: "heavy-winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf5,
    inHighDemand: false,
    colourRef: "navy and dusty rose",
  },
  {
    id: "golden-floral",
    name: "Golden Floral",
    weight: "heavy-winter",
    price: 19.99,
    image: scarf6,
    inHighDemand: true,
    colourRef: "warm mustard",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const getWeightLabel = (weight: ProductWeight) =>
  weight === "lightweight" ? "Lightweight — Autumn & Winter" : "Heavy Winter";

export const getProductDescription = (colourRef: string) =>
  `Elevate your wardrobe effortlessly with this soft jacquard-style weave with neatly finished edges. Warm and feminine without being bulky — easy to drape and wrap for everyday wear. Designed to add a touch of ${colourRef} and timeless pattern to an otherwise grey UK winter. Pairs beautifully with neutral coats and jumpers. A piece you'll reach for again and again.`;
