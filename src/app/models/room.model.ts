export interface Room {
  id: string;
  name: string;
  price: number;
  badge: 'popular' | 'pro' | 'std';
  badgeLabel: string;
  featured: boolean;
  features: string[];
}
