import scarf1 from "@/assets/products/scarf-1.jpg";
import scarf2 from "@/assets/products/scarf-2.jpg";
import scarf21 from "@/assets/products/scarf-2-1.jpg";
import scarf3 from "@/assets/products/scarf-3.jpg";
import scarf31 from "@/assets/products/scarf-3-1.jpg";
import scarf32 from "@/assets/products/scarf-3-2.jpg";
import scarf33 from "@/assets/products/scarf-3-3.jpg";
import scarf4 from "@/assets/products/scarf-4.jpg";
import scarf5 from "@/assets/products/scarf-5.jpg";
import scarf6 from "@/assets/products/scarf-6.jpg";
import scarf7 from "@/assets/products/scarf-7.jpg";
import scarf8 from "@/assets/products/scarf-8.jpg";
import scarf9 from "@/assets/products/scarf-9.jpg";
import scarf91 from "@/assets/products/scarf-9-1.jpg";
import scarf92 from "@/assets/products/scarf-9-2.jpg";
import scarf93 from "@/assets/products/scarf-9-3.jpg";
import scarf10 from "@/assets/products/scarf-10.jpg";
import scarf11 from "@/assets/products/scarf-11.jpg";
import scarf12 from "@/assets/products/scarf-12.jpg";
import scarf13 from "@/assets/products/scarf-13.jpg";
import scarf14 from "@/assets/products/scarf-14.jpg";
import scarf15 from "@/assets/products/scarf-15.jpg";
import scarf16 from "@/assets/products/scarf-16.jpg";
import scarf17 from "@/assets/products/scarf-17.jpg";
import scarf18 from "@/assets/products/scarf-18.jpg";
import scarf19 from "@/assets/products/scarf-19.jpg";
import scarf20 from "@/assets/products/scarf-20.jpg";
import scarf201 from "@/assets/products/scarf-20-1.jpg";
import scarf202 from "@/assets/products/scarf-20-2.jpg";
import scarf21New from "@/assets/products/scarf-21.jpg";
import scarf211 from "@/assets/products/scarf-21-1.jpg";
import scarf212 from "@/assets/products/scarf-21-2.jpg";
import scarf22 from "@/assets/products/scarf-22.jpg";
import scarf221 from "@/assets/products/scarf-22-1.jpg";
import scarf222 from "@/assets/products/scarf-22-2.jpg";
import scarf23 from "@/assets/products/scarf-23.jpg";
import scarf231 from "@/assets/products/scarf-23-1.jpg";
import scarf232 from "@/assets/products/scarf-23-2.jpg";
import scarf24 from "@/assets/products/scarf-24.jpg";
import scarf241 from "@/assets/products/scarf-24-1.jpg";
import scarf242 from "@/assets/products/scarf-24-2.jpg";
import scarf25 from "@/assets/products/scarf-25.jpg";
import scarf251 from "@/assets/products/scarf-25-1.jpg";
import scarf252 from "@/assets/products/scarf-25-2.jpg";
import scarf26 from "@/assets/products/scarf-26.jpg";
import scarf261 from "@/assets/products/scarf-26-1.jpg";
import scarf262 from "@/assets/products/scarf-26-2.jpg";
import scarf27 from "@/assets/products/scarf-27.jpg";
import scarf271 from "@/assets/products/scarf-27-1.jpg";
import scarf28 from "@/assets/products/scarf-28.jpg";
import scarf281 from "@/assets/products/scarf-28-1.jpg";
import scarf282 from "@/assets/products/scarf-28-2.jpg";
import scarf29 from "@/assets/products/scarf-29.jpg";
import scarf291 from "@/assets/products/scarf-29-1.jpg";
import scarf292 from "@/assets/products/scarf-29-2.jpg";
import scarf30 from "@/assets/products/scarf-30.jpg";
import scarf301 from "@/assets/products/scarf-30-1.jpg";
import scarf302 from "@/assets/products/scarf-30-2.jpg";
import scarf31New from "@/assets/products/scarf-31.jpg";
import scarf311 from "@/assets/products/scarf-31-1.jpg";
import scarf312 from "@/assets/products/scarf-31-2.jpg";
import scarf32New from "@/assets/products/scarf-32.jpg";
import scarf321 from "@/assets/products/scarf-32-1.jpg";
import scarf322 from "@/assets/products/scarf-32-2.jpg";
import scarf33New from "@/assets/products/scarf-33.jpg";
import scarf331 from "@/assets/products/scarf-33-1.jpg";
import scarf332 from "@/assets/products/scarf-33-2.jpg";
import scarf34 from "@/assets/products/scarf-34.jpg";
import scarf341 from "@/assets/products/scarf-34-1.jpg";
import scarf35 from "@/assets/products/scarf-35.jpg";
import scarf351 from "@/assets/products/scarf-35-1.jpg";
import scarf36 from "@/assets/products/scarf-36.jpg";
import scarf361 from "@/assets/products/scarf-36-1.jpg";
import scarf37 from "@/assets/products/scarf-37.jpg";
import scarf371 from "@/assets/products/scarf-37-1.jpg";
import scarf38 from "@/assets/products/scarf-38.jpg";
import scarf381 from "@/assets/products/scarf-38-1.jpg";
import scarf39 from "@/assets/products/scarf-39.jpg";
import scarf391 from "@/assets/products/scarf-39-1.jpg";
import scarf40 from "@/assets/products/scarf-40.jpg";
import scarf401 from "@/assets/products/scarf-40-1.jpg";
import scarf41 from "@/assets/products/scarf-41.jpg";
import scarf411 from "@/assets/products/scarf-41-1.jpg";

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
    images: [scarf1],
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
    images: [scarf2, scarf21],
    inHighDemand: false,
    colourRef: "dusty sage and blush",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    weight: "lightweight",
    price: 16.99,
    image: scarf3,
    images: [scarf3, scarf31, scarf32, scarf33],
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
    images: [scarf4],
    inHighDemand: true,
    colourRef: "rich burgundy and camel",
  },
  {
    id: "royal-blue-pink",
    name: "Royal Blue and Dusty Pink",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf5,
    images: [scarf5],
    inHighDemand: false,
    colourRef: "royal blue and dusty pink",
  },
  {
    id: "golden-floral",
    name: "Golden Floral",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf6,
    images: [scarf6],
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
    images: [scarf7],
    inHighDemand: false,
    colourRef: "dusty pink",
  },
  {
    id: "apricot-blossom-fringe",
    name: "Apricot Blossom Fringe Scarf",
    weight: "winter",
    price: 0.49,
    image: scarf8,
    images: [scarf8],
    inHighDemand: false,
    colourRef: "apricot blossom",
  },
  {
    id: "muted-saffron-heritage",
    name: "Muted Saffron Heritage Wrap",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf9,
    images: [scarf9, scarf91, scarf92, scarf93],
    inHighDemand: false,
    colourRef: "muted saffron heritage",
  },
  {
    id: "olive-blossom-fringe",
    name: "Olive Blossom Fringe Scarf",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf10,
    images: [scarf10],
    inHighDemand: false,
    colourRef: "olive blossom",
  },
  {
    id: "butter-meadow",
    name: "Butter Meadow",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf11,
    images: [scarf11],
    inHighDemand: false,
    colourRef: "soft butter yellow",
  },
  {
    id: "rose-petal-drift",
    name: "Rose Petal Drift",
    weight: "lightweight",
    price: 16.99,
    image: scarf12,
    images: [scarf12],
    inHighDemand: true,
    colourRef: "dusty rose",
  },
  {
    id: "powder-blue-daisy",
    name: "Powder Blue Daisy",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf13,
    images: [scarf13],
    inHighDemand: false,
    colourRef: "soft powder blue",
  },
  {
    id: "peach-blossom-whisper",
    name: "Peach Blossom Whisper",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf14,
    images: [scarf14],
    inHighDemand: false,
    colourRef: "warm peach",
  },
  {
    id: "mint-sundrop",
    name: "Mint Sundrop",
    weight: "lightweight",
    price: 16.99,
    image: scarf15,
    images: [scarf15],
    inHighDemand: false,
    colourRef: "soft mint",
  },
  {
    id: "forest-leaf-jacquard",
    name: "Forest Leaf Jacquard",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf16,
    images: [scarf16],
    inHighDemand: true,
    colourRef: "deep forest green and camel",
  },
  {
    id: "plum-rose-wrap",
    name: "Plum Rose Wrap",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf17,
    images: [scarf17],
    inHighDemand: false,
    colourRef: "rich plum and rose",
  },
  {
    id: "chocolate-paisley",
    name: "Chocolate Paisley",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf18,
    images: [scarf18],
    inHighDemand: false,
    colourRef: "chocolate brown and caramel",
  },
  {
    id: "teal-mustard-bloom",
    name: "Teal Mustard Bloom",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf19,
    images: [scarf19],
    inHighDemand: true,
    colourRef: "deep teal and mustard",
  },
  {
    id: "coral-garden-whisper",
    name: "Coral Garden Whisper",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf20,
    images: [scarf20, scarf201, scarf202],
    inHighDemand: false,
    colourRef: "soft coral pink",
  },
  {
    id: "blush-botanical-loop",
    name: "Blush Botanical Loop",
    weight: "lightweight",
    price: 16.99,
    image: scarf21New,
    images: [scarf21New, scarf211, scarf212],
    inHighDemand: true,
    colourRef: "dusty blush pink",
  },
  {
    id: "porcelain-sprig",
    name: "Porcelain Sprig",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf22,
    images: [scarf22, scarf221, scarf222],
    inHighDemand: false,
    colourRef: "ivory cream with sage and rose sprigs",
  },
  {
    id: "daisy-sky-drape",
    name: "Daisy Sky Drape",
    weight: "lightweight",
    price: 16.99,
    image: scarf23,
    images: [scarf23, scarf231, scarf232],
    inHighDemand: false,
    colourRef: "soft sky blue",
  },
  {
    id: "violet-vine-sheen",
    name: "Violet Vine Sheen",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf24,
    images: [scarf24, scarf241, scarf242],
    inHighDemand: false,
    colourRef: "soft lilac purple",
  },
  {
    id: "champagne-bloom",
    name: "Champagne Bloom",
    weight: "lightweight",
    price: 16.99,
    image: scarf25,
    images: [scarf25, scarf251, scarf252],
    inHighDemand: false,
    colourRef: "warm champagne beige",
  },
  {
    id: "seafoam-blossom",
    name: "Seafoam Blossom",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf26,
    images: [scarf26, scarf261, scarf262],
    inHighDemand: true,
    colourRef: "soft seafoam green",
  },
  {
    id: "mauve-rose-veil",
    name: "Mauve Rose Veil",
    weight: "lightweight",
    price: 16.99,
    image: scarf27,
    images: [scarf27, scarf271],
    inHighDemand: false,
    colourRef: "dusty mauve",
  },
  {
    id: "apricot-wildflower",
    name: "Apricot Wildflower",
    weight: "lightweight",
    price: 12.99,
    originalPrice: 16.99,
    image: scarf28,
    images: [scarf28, scarf281, scarf282],
    inHighDemand: false,
    colourRef: "pale apricot peach",
  },
  {
    id: "terracotta-paisley-air",
    name: "Terracotta Paisley Air",
    weight: "lightweight",
    price: 16.99,
    image: scarf29,
    images: [scarf29, scarf291, scarf292],
    inHighDemand: false,
    colourRef: "soft terracotta clay",
  },
  {
    id: "emerald-heirloom-jacquard",
    name: "Emerald Heirloom Jacquard",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf30,
    images: [scarf30, scarf301, scarf302],
    inHighDemand: true,
    colourRef: "deep emerald green and ivory",
  },
  {
    id: "midnight-gold-bloom",
    name: "Midnight Gold Bloom",
    weight: "winter",
    price: 25.99,
    image: scarf31New,
    images: [scarf31New, scarf311, scarf312],
    inHighDemand: false,
    colourRef: "deep navy and champagne gold",
  },
  {
    id: "camel-paisley-heritage",
    name: "Camel Paisley Heritage",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf32New,
    images: [scarf32New, scarf321, scarf322],
    inHighDemand: false,
    colourRef: "warm camel beige and burgundy",
  },
  {
    id: "rose-vine-winter-wrap",
    name: "Rose Vine Winter Wrap",
    weight: "winter",
    price: 25.99,
    image: scarf33New,
    images: [scarf33New, scarf331, scarf332],
    inHighDemand: false,
    colourRef: "dusty rose pink and cream",
  },
  {
    id: "charcoal-floral-weave",
    name: "Charcoal Floral Weave",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf34,
    images: [scarf34, scarf341],
    inHighDemand: false,
    colourRef: "charcoal grey and ivory",
  },
  {
    id: "lavender-frost-jacquard",
    name: "Lavender Frost Jacquard",
    weight: "winter",
    price: 25.99,
    image: scarf35,
    images: [scarf35, scarf351],
    inHighDemand: false,
    colourRef: "dusty lavender and silver",
  },
  {
    id: "rust-paisley-wrap",
    name: "Rust Paisley Wrap",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf36,
    images: [scarf36, scarf361],
    inHighDemand: true,
    colourRef: "warm rust orange and cream",
  },
  {
    id: "ivory-sage-leaf",
    name: "Ivory Sage Leaf",
    weight: "winter",
    price: 25.99,
    image: scarf37,
    images: [scarf37, scarf371],
    inHighDemand: false,
    colourRef: "ivory cream and sage green",
  },
  {
    id: "wine-garden-wrap",
    name: "Wine Garden Wrap",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf38,
    images: [scarf38, scarf381],
    inHighDemand: false,
    colourRef: "deep maroon wine red and gold",
  },
  {
    id: "teal-rose-woven",
    name: "Teal Rose Woven",
    weight: "winter",
    price: 25.99,
    image: scarf39,
    images: [scarf39, scarf391],
    inHighDemand: false,
    colourRef: "muted teal blue green with blush florals",
  },
  {
    id: "mustard-botanical-rich",
    name: "Mustard Botanical Rich",
    weight: "winter",
    price: 19.99,
    originalPrice: 25.99,
    image: scarf40,
    images: [scarf40, scarf401],
    inHighDemand: false,
    colourRef: "warm mustard yellow with cocoa florals",
  },
  {
    id: "blush-damask-soft",
    name: "Blush Damask Soft",
    weight: "winter",
    price: 25.99,
    image: scarf41,
    images: [scarf41, scarf411],
    inHighDemand: false,
    colourRef: "soft blush pink and ivory",
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);

export const getWeightLabel = (weight: ProductWeight) =>
  weight === "lightweight" ? "Lightweight — Spring & Summer" : "Warm — Autumn & Winter";

export const getProductDescription = (weight: ProductWeight, colourRef: string) =>
  weight === "winter"
    ? `A soft winter scarf for women in the UK, designed for warmth without heaviness. Created for colder days, while remaining comfortable indoors and outdoors. A warm, soft fabric that holds heat while keeping a gentle feel against the skin, finished in a quiet shade of ${colourRef}. Layers easily with coats and knitwear, without overwhelming the outfit. Warmth that feels natural, and settles easily into your routine.`
    : `A lightweight summer scarf for women in the UK, designed for breathable comfort and ease. Made for warm days that shift gently into cooler moments — easy to layer over dresses and everyday wear without adding weight. A soft, breathable fabric with a fluid drape, finished in a considered shade of ${colourRef} that sits naturally within your wardrobe. A scarf that stays with you through the day, without ever feeling like too much.`;

export const getProductWashInstructions = (weight: ProductWeight) =>
  weight === "winter"
    ? `Dry clean or hand wash cold. Do not tumble dry. Lay flat to dry. Iron on low heat with a cloth.`
    : `Hand wash cold with mild detergent. Do not wring. Lay flat to dry. Iron on lowest setting or steam lightly.`;
