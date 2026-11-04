
import { useEffect, useState } from 'react'

import EditProductForm from '../components/EditProductForm'
import { signOut } from '../services/auth'
import { getProducts, deleteProduct } from '../services/products'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../types/product'

export default function Dashboard() {
  const { user } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

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
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Delete product handler
  async function handleDelete(productId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await deleteProduct(productId)

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      )

      if (editingProductId === productId) {
        setEditingProductId(null)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete product'
      )
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome to LaunchDeck
            </h1>
            <p className="mt-2 text-zinc-400">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {/* Products Section */}
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">
            My Products
          </h2>

          {loading && (
            <p className="text-zinc-400">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-zinc-400">
              No products yet. Create your first product!
            </p>
          )}

          {/* Product Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h3 className="text-xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {product.tagline}
                </p>

                <p className="mt-4 text-xs text-zinc-500">
                  Status: {product.status}
                </p>

                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-indigo-400 hover:underline"
                >
                  Visit website →
                </a>

                {/* Edit Button */}
                <button
                  onClick={() => setEditingProductId(product.id)}
                  className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-800"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product.id)}
                  className="ml-2 rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500"
                >
                  Delete
                </button>

                {/* Edit Form */}
                {editingProductId === product.id && (
                  <EditProductForm
                    product={product}
                    onUpdated={(updatedProduct) => {
                      setProducts((currentProducts) =>
                        currentProducts.map((item) =>
                          item.id === updatedProduct.id
                            ? updatedProduct
                            : item
                        )
                      )

                      setEditingProductId(null)
                    }}
                    onCancel={() => setEditingProductId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
