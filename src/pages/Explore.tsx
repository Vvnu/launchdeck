
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getLaunchedProducts } from '../services/products'
import type { Product, ProductCategory } from '../types/product'
import NotificationBell from '../components/NotificationBell'


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

export default function Explore() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const searchTerm = search.toLowerCase().trim()

        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm) ||
          product.tagline.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)

        const matchesCategory =
          selectedCategory === 'All' ||
          product.category === selectedCategory

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            )

          case 'az':
            return a.name.localeCompare(b.name)

          case 'za':
            return b.name.localeCompare(a.name)

          case 'newest':
          default:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            )
        }
      })
  }, [products, search, selectedCategory, sortBy])

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <Link to="/explore" className="text-xl font-bold tracking-tight">
            Launch<span className="text-indigo-400">Deck</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/explore"
              className="text-sm text-white"
            >
              Explore
            </Link>

            <Link
              to="/dashboard"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
            >
              Dashboard →
            </Link>
            <NotificationBell />
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/70">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:py-24">

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            THE PRODUCT DISCOVERY PLATFORM
          </span>

          <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Discover products.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Explore new ideas.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Explore interesting products built by creators.
            Find tools, discover ideas and see what's launching.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 shadow-2xl shadow-black/20 transition focus-within:border-indigo-500/50">

            <span className="pl-3 text-xl text-zinc-500">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, tools or ideas..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                Clear
              </button>
            )}

          </div>

        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-5 py-12">

        {/* Section heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Discover
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Explore Products
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Find something useful or get inspired by what others build.
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-xs text-zinc-500">
              Sort by
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-zinc-300 outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Name: A–Z</option>
              <option value="za">Name: Z–A</option>
            </select>
          </div>

        </div>

        {/* Category filters */}
        <div className="mt-7 flex flex-wrap gap-2">

          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
              selectedCategory === 'All'
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                selectedCategory === category
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* Results count */}
        <div className="mt-8 flex items-center justify-between border-b border-zinc-800 pb-4">
          <p className="text-sm text-zinc-400">
            {loading
              ? 'Loading products...'
              : `${filteredProducts.length} products found`}
          </p>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Clear category filter
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60"
              />
            ))}
          </div>
        )}

        {/* Product cards */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-zinc-900"
              >

                {/* Card top */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-lg font-bold text-indigo-300">
                    {product.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                    Launched
                  </span>

                </div>

                {/* Product information */}
                <div className="mt-5 flex-1">

                  <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-indigo-300">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-400">
                    {product.tagline}
                  </p>

                  <p className="mt-4 line-clamp-3 text-xs leading-6 text-zinc-500">
                    {product.description}
                  </p>

                </div>

                {/* Card bottom */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">

                  <span className="max-w-[65%] truncate rounded-md bg-zinc-800 px-2.5 py-1.5 text-[10px] font-medium text-zinc-300">
                    {product.category}
                  </span>

                  <Link
                    to={`/products/${product.slug}`}
                    className="shrink-0 rounded-lg bg-indigo-600/10 px-3 py-2 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-600 hover:text-white"
                  >
                    View Product →
                  </Link>

                </div>

              </article>
            ))}

          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-5 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl">
              ⌕
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No products found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              {search || selectedCategory !== 'All'
                ? 'Try changing your search or category filter.'
                : 'No products have been launched yet. Check back soon!'}
            </p>

            {(search || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('All')
                }}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold hover:bg-indigo-500"
              >
                Clear all filters
              </button>
            )}

          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-zinc-600 sm:flex-row">
          <p>
            © {new Date().getFullYear()} LaunchDeck. Built for creators.
          </p>

          <Link
            to="/dashboard"
            className="transition hover:text-zinc-300"
          >
            Launch your product →
          </Link>
        </div>
      </footer>

    </main>
  )
}
