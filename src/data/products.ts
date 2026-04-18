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
  images?: string[];
  inHighDemand: boolean;
  colourRef: string;
}

export const getProductImages = (product: Product): string[] =>
  product.images && product.images.length > 0 ? product.images : [product.image];

export const products: Product[] = [
  {
    id: "soft-terracotta-bloom",
    name: "Soft Terracotta Bloom",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf1,
    images: [scarf1, scarf2, scarf3],
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
    images: [scarf2, scarf3, scarf1],
    inHighDemand: false,
    colourRef: "dusty sage and blush",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    weight: "lightweight",
    price: 12.99,
    image: scarf3,
    images: [scarf3, scarf1, scarf2],
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
    images: [scarf4, scarf5, scarf6],
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
    images: [scarf6, scarf4, scarf7],
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
    images: [scarf7, scarf6, scarf4],
    inHighDemand: true,
    colourRef: "dusty pink",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const getWeightLabel = (weight: ProductWeight) =>
  weight === "lightweight" ? "Lightweight — Summar & Autumn" : "Winter";

export const getProductDescription = (weight: ProductWeight, colourRef: string) =>
  weight === "winter"
    ? `Elevate your wardrobe effortlessly with this richly woven jacquard scarf, where the pattern is built into the fabric itself - not printed, not painted, but woven in. Warm and feminine without being bulky, it drapes beautifully and wraps with ease. Neatly finished edges, timeless floral pattern, soft enough to wear against the skin. Designed to add a quiet pop of ${colourRef} to an otherwise grey UK winter. Pairs beautifully with coats and jumpers. The kind of piece you reach for every morning without thinking.`
    : `Soft as a whisper and light as air - this scarf is the one you didn't know your wardrobe was missing. A fluid, silk-touch weave that drapes effortlessly and moves with you through the day. Worn loose over a blouse, tucked into a knit, or thrown over a shoulder on a cool autumn evening - it works every time. Adds a gentle pop of ${colourRef} without effort, without thought. Equally at home at brunch or at the office. The kind of piece you buy in one colour and come back for in three more.`;

export const getProductWashInstructions = (weight: ProductWeight) =>
    weight === "winter"
    ? `Dry clean or hand wash cold. Do not tumble dry. Lay flat to dry. Iron on low heat with a cloth.`
    : `Hand wash cold with mild detergent. Do not wring. Lay flat to dry. Iron on lowest setting or steam lightly.`