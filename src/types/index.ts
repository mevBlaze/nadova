// Product types for Nadova Labs

export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  dosage: string;
  purity: string;
  badge?: string;
  category_id: string;
  mechanism_of_action: string;
  benefits: ProductBenefit[];
  safety_profile: string;
  regulatory_status: string;
  research_references: ResearchReference[];
  image_url?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ProductBenefit {
  title: string;
  description: string;
  stats?: string;
}

export interface ResearchReference {
  title: string;
  url: string;
  source: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  product_count?: number;
}

export interface Goal {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  product_ids: string[];
}

export interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content: string;
  content_type: 'text' | 'html' | 'json' | 'markdown';
  page: string;
  section?: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  order: number;
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  weights: Record<string, number>; // category_id -> weight
}

export interface QuizResult {
  products: Product[];
  reasoning: string;
  confidence: number;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

// QR Code Product Verification
export interface QrCode {
  id: string;
  code: string;
  status: 'draft' | 'active' | 'expired' | 'recalled';
  product_name: string | null;
  product_image: string | null;
  batch_number: string | null;
  expiration_date: string | null;
  concentration: string | null;
  purity: string | null;
  description: string | null;
  storage_info: string | null;
  coa_url: string | null;
  extra_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type QrCodeStatus = QrCode['status'];
