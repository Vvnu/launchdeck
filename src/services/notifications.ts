
import { supabase } from './supabase'

export interface Notification {
  id: string
  user_id: string
  product_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  product?: {
    name: string
    slug: string
  }[] | null
}

// Fetch notifications for the logged-in user
export async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      id,
      user_id,
      product_id,
      type,
      title,
      message,
      is_read,
      created_at,
      product:products (
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error

  return data as Notification[]
}

// Get the number of unread notifications
export async function getUnreadCount() {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  if (error) throw error

  return count ?? 0
}

// Mark one notification as read
export async function markNotificationAsRead(
  notificationId: string
) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('is_read', false)

  if (error) throw error
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)

  if (error) throw error
}
