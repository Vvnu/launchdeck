export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  category: ProductCategory
  status: 'draft' | 'launched'
  created_at: string
  owner_id: string
}

export type ProductCategory =
  | 'AI & Machine Learning'
  | 'Developer Tools'
  | 'Productivity'
  | 'Design'
  | 'Marketing'
  | 'Finance'
  | 'Education'
  | 'Other'