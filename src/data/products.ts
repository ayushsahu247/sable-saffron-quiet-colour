import scarf1 from "@/assets/products/scarf-1.jpg";
import scarf2 from "@/assets/products/scarf-2.jpg";
import scarf3 from "@/assets/products/scarf-3.jpg";
import scarf4 from "@/assets/products/scarf-4.jpg";
import scarf5 from "@/assets/products/scarf-5.jpg";
import scarf6 from "@/assets/products/scarf-6.jpg";
import scarf7 from "@/assets/products/scarf-7.jpg";

export type ProductWeight = "lightweight" | "winter";

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
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf4,
    inHighDemand: true,
    colourRef: "rich burgundy and camel",
  },
  {
    id: "golden-floral",
    name: "Golden Floral",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf6,
    inHighDemand: true,
    colourRef: "warm mustard",
  },
    {
      id: "dusty-pink-floral",
      name: "Dusty Pink Floral",
      weight: "winter",
      price: 19.99,
      originalPrice: 25.99,
      image: scarf7,
      inHighDemand: true,
      colourRef: "dusty pink",
    },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const getWeightLabel = (weight: ProductWeight) =>
  weight === "lightweight" ? "Lightweight — Summar & Autumn" : "Winter";

export const getProductDescription = (colourRef: string) =>
  `Elevate your wardrobe effortlessly with this soft jacquard-style weave with neatly finished edges. Warm and feminine without being bulky — easy to drape and wrap for everyday wear. Designed to add a touch of ${colourRef} and timeless pattern to an otherwise grey UK winter. Pairs beautifully with neutral coats and jumpers. A piece you'll reach for again and again.`;
