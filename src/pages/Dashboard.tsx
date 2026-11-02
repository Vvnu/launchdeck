

import { signOut } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  async function handleLogout() {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <main>
      <h1>Welcome to LaunchDeck</h1>
      <p>{user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </main>
  )
}