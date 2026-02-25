export interface StatItem {
  value: number;   // numeric target for count-up animation
  suffix: string;  // appended after number, e.g. "+" or ""
  label: string;   // translated label below number
}

export interface Testimonial {
  id: string;      // stable unique ID e.g. "testimonial-1"
  quote: string;
  author: string;
  role: string;    // e.g. "Loyal Client" or "Certified Graduate"
}

export interface Category {
  id: string;      // stable slug, e.g. "facial" — used as AnimatePresence key
  label: string;   // translated display name
}

export interface Treatment {
  id: string;      // stable unique slug, e.g. "hydra-facial" — NEVER use array index
  category: string; // matches a Category.id
  name: string;
  description: string;
  duration: string; // e.g. "60 dk" / "60 min" / "٦٠ دقيقة"
  price: string;   // e.g. "₺850"
}

export interface TeaserCard {
  id: string;
  title: string;
  description: string;
}
