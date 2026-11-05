
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from '../services/notifications'

export default function NotificationBell() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch notifications and unread count
  async function loadNotifications() {
    try {
      setError('')

      const [notificationData, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ])

      setNotifications(notificationData)
      setUnreadCount(count)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notifications'
      )
    } finally {
      setLoading(false)
    }
  }

  // Initial load and Supabase Realtime subscription
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    setLoading(true)
    void loadNotifications()

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refresh list and unread count when a notification changes
          void loadNotifications()
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user?.id, authLoading])

  function formatDate(date: string) {
    const difference = Math.max(
      0,
      Date.now() - new Date(date).getTime()
    )

    const minutes = Math.floor(difference / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`

    return new Date(date).toLocaleDateString()
  }

  // Open a notification
  async function handleNotificationClick(
    notification: Notification
  ) {
    if (!user) return

    try {
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id)

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, is_read: true }
              : item
          )
        )

        setUnreadCount((current) => Math.max(0, current - 1))
      }

      setIsOpen(false)

      const slug = notification.product?.[0]?.slug

      navigate(slug ? `/products/${slug}` : '/explore')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to open notification'
      )
    }
  }

  // Mark every notification as read
  async function handleMarkAllRead() {
    if (!user) return

    try {
      await markAllNotificationsAsRead()

      setNotifications((current) =>
        current.map((item) => ({ ...item, is_read: true }))
      )

      setUnreadCount(0)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to mark notifications as read'
      )
    }
  }

  // Don't show the bell to logged-out visitors
  if (authLoading || !user) return null

  return (
    <div className="relative">
      {/* Notification bell */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-zinc-950">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
            <div>
              <h3 className="font-semibold text-white">
                Notifications
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : 'You are all caught up'}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-100 overflow-y-auto">

            {loading && (
              <p className="px-4 py-10 text-center text-sm text-zinc-500">
                Loading notifications...
              </p>
            )}

            {!loading && error && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  type="button"
                  onClick={loadNotifications}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
                  <span className="text-xl">🔔</span>
                </div>

                <p className="text-sm font-medium text-white">
                  No notifications yet
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  New product launches will appear here.
                </p>
              </div>
            )}

            {!loading && !error && notifications.map((notification) => (
              <button
                type="button"
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full gap-3 border-b border-zinc-900 px-4 py-4 text-left transition hover:bg-zinc-900/80 ${
                  !notification.is_read ? 'bg-indigo-500/6' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <span className="text-lg">✦</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${
                      notification.is_read
                        ? 'font-medium text-zinc-300'
                        : 'font-semibold text-white'
                    }`}>
                      {notification.title}
                    </p>

                    {!notification.is_read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] text-zinc-600">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
              </button>
            ))}

          </div>
        </div>
      )}
    </div>
  )
}
