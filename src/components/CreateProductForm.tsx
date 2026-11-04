
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createProduct } from '../services/products'

interface CreateProductFormProps {
  onCreated: () => void
}

export default function CreateProductForm({
  onCreated,
}: CreateProductFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await createProduct({
        name,
        slug,
        tagline,
        description,
        website_url: websiteUrl,
      })

      // Notify the parent page that creation succeeded.
      onCreated()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
      <h2 className="text-2xl font-bold">Create a Product</h2>

      <p className="mt-2 text-sm text-zinc-400">
        Tell the world what you're building.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
        />

        <input
          type="text"
          placeholder="URL slug (e.g. my-product)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
        />

        <input
          type="text"
          placeholder="Short tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
        />

        <textarea
          placeholder="Describe your product..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
        />

        <input
          type="url"
          placeholder="Website URL (https://...)"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 p-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
