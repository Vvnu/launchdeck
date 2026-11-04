import { supabase } from './supabase'

interface CreateProductInput {
  name: string
  slug: string
  tagline: string
  description: string
  website_url: string
}

export async function createProduct(input: CreateProductInput) {
  // Get the currently authenticated user
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError

  if (!user) {
    throw new Error('You must be logged in to create a product')
  }

  // Insert product into database
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) throw error

  return data
}





export async function getProducts() {
  // Get authenticated user
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError

  if (!user) {
    throw new Error('You must be logged in')
  }

  // Fetch products belonging to this user
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}



interface UpdateProductInput {
  name?: string
  slug?: string
  tagline?: string
  description?: string
  website_url?: string
  status?: 'draft' | 'launched'

}

export async function updateProduct(
  productId: string,
  updates: UpdateProductInput
) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (userError) throw userError

  if (!user) {
    throw new Error('You must be logged in')
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) throw error

  return data
}




export async function deleteProduct(productId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError

  if (!user) {
    throw new Error('You must be logged in')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('owner_id', user.id)

  if (error) throw error
}




// Fetch all publicly launched products
export async function getLaunchedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'launched')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

// Fetch one publicly launched product using its slug
export async function getLaunchedProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'launched')
    .maybeSingle()

  if (error) throw error

  return data
}