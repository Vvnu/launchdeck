import { useState } from 'react'
import { updateProduct } from '../services/products'
import type { Product } from '../types/product'
import type { ProductCategory } from '../types/product'


interface EditProductFormProps {
  product: Product
  onUpdated: (updatedProduct: Product) => void
  onCancel: () => void
}

export default function EditProductForm({
  product,
  onUpdated,
  onCancel,
}: EditProductFormProps) {
  const [name, setName] = useState(product.name)
  const [slug, setSlug] = useState(product.slug)
  const [tagline, setTagline] = useState(product.tagline)
  const [description, setDescription] = useState(product.description)
  const [category, setCategory] = useState(product.category)
  const [websiteUrl, setWebsiteUrl] = useState(product.website_url)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updatedProduct = await updateProduct(product.id, {
        name,
        slug,
        tagline,
        description,
        website_url: websiteUrl,
        category,
      })

      onUpdated(updatedProduct as Product)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update product'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <h3 className="text-lg font-semibold">Edit Product</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
      />

      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Product slug"
        required
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
      />

      <input
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        placeholder="Tagline"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
      />

<div>
  <label className="mb-1.5 block text-sm text-zinc-300">
    Product Category
  </label>

  <select
    value={category}
    onChange={(e) =>
      setCategory(e.target.value as ProductCategory)
    }
    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
  >
    <option value="AI & Machine Learning">AI & Machine Learning</option>
    <option value="Developer Tools">Developer Tools</option>
    <option value="Productivity">Productivity</option>
    <option value="Design">Design</option>
    <option value="Marketing">Marketing</option>
    <option value="Finance">Finance</option>
    <option value="Education">Education</option>
    <option value="Other">Other</option>
  </select>
</div>


      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
      />

      <input
        type="url"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        placeholder="Website URL"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-700 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}