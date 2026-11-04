import { useNavigate } from 'react-router-dom'
import CreateProductForm from '../components/CreateProductForm'

export default function AddProduct() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <button onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h1 className="mt-8 text-3xl font-bold">
        Add a New Product
      </h1>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
    <CreateProductForm
  onCreated={() => navigate('/dashboard', { replace: true })}
/>      </div>
    </main>
  )
}