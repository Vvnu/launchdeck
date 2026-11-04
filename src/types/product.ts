export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
  status: 'draft' | 'launched'
  created_at: string
  owner_id: string
}