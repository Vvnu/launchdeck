
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLaunchedProductBySlug } from '../services/products'
import type { Product } from '../types/product'

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const data = await getLaunchedProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load product'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">

        <header className="flex items-center justify-between">
          <Link to="/explore" className="text-2xl font-bold">
            LaunchDeck
          </Link>

          <Link
            to="/explore"
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Explore Products
          </Link>
        </header>

        {loading && (
          <p className="mt-16 text-center text-zinc-400">
            Loading product...
          </p>
        )}

        {error && (
          <p className="mt-16 text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && !product && (
          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold">
              Product Not Found
            </h1>

            <p className="mt-3 text-zinc-400">
              This product doesn't exist or hasn't been launched yet.
            </p>

            <Link
              to="/explore"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 hover:bg-indigo-500"
            >
              Explore Products
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <article className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
              Launched
            </span>

            <h1 className="mt-6 text-4xl font-bold">
              {product.name}
            </h1>

            <p className="mt-4 text-xl text-zinc-400">
              {product.tagline}
            </p>

            <div className="mt-10 border-t border-zinc-800 pt-8">
              <h2 className="text-xl font-semibold">
                About this product
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-zinc-300">
                {product.description}
              </p>
            </div>

            <a
              href={product.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
            >
              Visit Website →
            </a>

          </article>
        )}

      </div>
    </main>
  )
}
