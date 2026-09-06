import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface StatCardItem {
  value: string;
  label: string;
  valueColor?: string;
}

export interface UseCaseItem {
  image: string;
  alt: string;
  title: string;
  description: string;
  spanClass: string;
  aspectClass: string;
}

export interface AvatarItem {
  src: string;
  alt: string;
  ring: string;
}

export interface HeroAvatarItem {
  src: string;
  alt: string;
}

export interface ReviewItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface FooterLinkItem {
  href: string;
  label: string;
}
