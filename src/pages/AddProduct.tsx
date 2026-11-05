
import { useNavigate } from 'react-router-dom'
import CreateProductForm from '../components/CreateProductForm'

export default function AddProduct() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* Page heading */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            LaunchDeck Workspace
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Add a New Product
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Share what you're building with the world.
          </p>
        </div>

        {/* Form container */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl sm:p-7">
          <CreateProductForm
            onCreated={() => navigate('/dashboard', { replace: true })}
          />
        </div>

        <p className="mt-5 text-center text-xs text-zinc-600">
          Your product will be saved as a draft. You can publish it later.
        </p>

      </div>
    </main>
  )
}
