
import { useState } from 'react'
import type { FormEvent } from 'react'

import { createProduct } from '../services/products'
import type { ProductCategory } from '../types/product'

interface CreateProductFormProps {
  onCreated: () => void
}

const categories: ProductCategory[] = [
  'AI & Machine Learning',
  'Developer Tools',
  'Productivity',
  'Design',
  'Marketing',
  'Finance',
  'Education',
  'Other',
]

const inputClass =
  'w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-500'

export default function CreateProductForm({
  onCreated,
}: CreateProductFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [category, setCategory] = useState<ProductCategory>('Other')
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
        category,
      })

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
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Product Information
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Add the basic details of your product.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product name and slug */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-zinc-300">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. LaunchDeck"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-zinc-300">
              URL Slug
            </label>
            <input
              type="text"
              placeholder="e.g. launchdeck"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Tagline and category */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-zinc-300">
              Tagline
            </label>
            <input
              type="text"
              placeholder="A short description"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-zinc-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ProductCategory)
              }
              className={inputClass}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm text-zinc-300">
            Description
          </label>
          <textarea
            placeholder="What does your product do? What problem does it solve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Website */}
        <div>
          <label className="mb-1.5 block text-sm text-zinc-300">
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end border-t border-zinc-800 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product →'}
          </button>
        </div>
      </form>
    </div>
  )
}
