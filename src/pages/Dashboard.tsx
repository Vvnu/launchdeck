
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import EditProductForm from '../components/EditProductForm'
import { signOut } from '../services/auth'
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from '../services/products'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../types/product'
import NotificationBell from '../components/NotificationBell'


export default function Dashboard() {
  const { user } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load products'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  async function handleLogout() {
    try {
      await signOut()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  async function handleDelete(productId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    )

    if (!confirmed) return

    setActionLoadingId(productId)
    setError('')

    try {
      await deleteProduct(productId)

      setProducts((current) =>
        current.filter((product) => product.id !== productId)
      )

      if (editingProductId === productId) {
        setEditingProductId(null)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete product'
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handlePublishToggle(product: Product) {
    const newStatus =
      product.status === 'draft' ? 'launched' : 'draft'

    setActionLoadingId(product.id)
    setError('')

    try {
      const updatedProduct = await updateProduct(product.id, {
        status: newStatus,
      })

      setProducts((current) =>
        current.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update product status'
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const launchedCount = products.filter(
    (product) => product.status === 'launched'
  ).length

  const draftCount = products.filter(
    (product) => product.status === 'draft'
  ).length

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/explore" className="text-xl font-bold tracking-tight">
            Launch<span className="text-indigo-400">Deck</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
            >
              Explore
            </Link>

              <NotificationBell />


            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-10">

        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              My Products
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Manage your products and track their launch status.
            </p>

            <p className="mt-3 text-xs text-zinc-600">
              Signed in as {user?.email}
            </p>
          </div>

          <Link
            to="/dashboard/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
          >
            <span className="text-lg">+</span>
            Add Product
          </Link>
        </section>

        {/* Statistics */}
        <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Total Products</p>
            <p className="mt-2 text-3xl font-bold">{products.length}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Launched</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {launchedCount}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {draftCount}
            </p>
          </div>
        </section>

        {/* Products section */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Products</h2>
              <p className="mt-1 text-sm text-zinc-500">
                All your creations in one place.
              </p>
            </div>

            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {products.length} products
            </span>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-sm text-zinc-500">
              Loading your products...
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-400">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No products yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Your next big idea deserves to be launched.
              </p>

              <Link
                to="/dashboard/products/new"
                className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
              >
                Create your first product
              </Link>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {products.map((product) => {
                const isEditing = editingProductId === product.id
                const isBusy = actionLoadingId === product.id

                return (
                  <article
                    key={product.id}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
                  >
                    {/* Card heading */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-500">
                          /{product.slug}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          product.status === 'launched'
                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {product.status === 'launched' ? '● Live' : '● Draft'}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="mt-4">
                      <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                        {product.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-400">
                      {product.tagline}
                    </p>

                    {/* Website */}
                    <a
                      href={product.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block max-w-full truncate text-xs text-indigo-400 transition hover:text-indigo-300 hover:underline"
                    >
                      {product.website_url} ↗
                    </a>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-4">
                      <button
                        onClick={() => setEditingProductId(isEditing ? null : product.id)}
                        disabled={isBusy}
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {isEditing ? 'Close Editor' : 'Edit'}
                      </button>

                      <button
                        onClick={() => handlePublishToggle(product)}
                        disabled={isBusy}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          product.status === 'draft'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        {isBusy
                          ? 'Please wait...'
                          : product.status === 'draft'
                            ? 'Publish Product'
                            : 'Unpublish'}
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isBusy}
                        className="ml-auto rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Edit form */}
                    {isEditing && (
                      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <EditProductForm
                          product={product}
                          onUpdated={(updatedProduct) => {
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === updatedProduct.id
                                  ? updatedProduct
                                  : item
                              )
                            )
                            setEditingProductId(null)
                          }}
                          onCancel={() => setEditingProductId(null)}
                        />
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
