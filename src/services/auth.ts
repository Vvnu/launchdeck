import { supabase } from './supabase'

// Register a new user
export async function signUp(
  fullName: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  return data
}

// Login existing user
export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) throw error

  return data
}

// Logout current user
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}