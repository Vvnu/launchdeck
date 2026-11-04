
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLaunchedProducts } from '../services/products'
import type { Product } from '../types/product'

export default function Explore() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getLaunchedProducts()
        setProducts(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load products'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">

        <header className="flex items-center justify-between">
          <Link to="/explore" className="text-2xl font-bold">
            LaunchDeck
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-500"
          >
            Dashboard
          </Link>
        </header>

        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Discover Products Worth Exploring.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Explore interesting products built and launched by creators.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">
            Recently Launched
          </h2>

          {loading && (
            <p className="text-zinc-400">Loading products...</p>
          )}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-zinc-400">
              No products have been launched yet. Check back soon!
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500"
              >
                <h3 className="text-xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {product.tagline}
                </p>

                <p className="mt-4 text-sm text-zinc-300">
                  {product.description.length > 120
                    ? `${product.description.slice(0, 120)}...`
                    : product.description}
                </p>

                <span className="mt-5 inline-block text-sm font-medium text-indigo-400">
                  View Product →
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
