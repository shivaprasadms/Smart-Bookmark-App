'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function BookmarkList({ user }: { user: User }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [supabase] = useState(() => createClient())

useEffect(() => {
  console.log('🔄 Setting up realtime for user:', user.id)
  fetchBookmarks()

  // Create channel with broadcast config
  const channel = supabase
    .channel('public:bookmarks:all', {
      config: {
        broadcast: { self: false }, // Don't receive own changes via broadcast
        presence: { key: user.id },
      },
    })
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bookmarks',
      },
      (payload) => {
        console.log('🔔 INSERT event received:', payload)
        const newBookmark = payload.new as Bookmark
        
        console.log('📝 New bookmark user_id:', newBookmark.user_id)
        console.log('👤 Current user_id:', user.id)
        
        if (newBookmark.user_id === user.id) {
          console.log('✅ This is for current user - adding to UI')
          setBookmarks((current) => {
            const exists = current.some(b => b.id === newBookmark.id)
            if (exists) {
              console.log('⚠️ Bookmark already exists in list')
              return current
            }
            console.log('➕ Adding bookmark to list')
            return [newBookmark, ...current]
          })
        } else {
          console.log('⏭️ This bookmark is for another user')
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'bookmarks',
      },
      (payload) => {
        console.log('🔔 DELETE event received:', payload)
        const deletedId = payload.old.id
        
        console.log('🗑️ Removing bookmark ID:', deletedId)
        
        // No user check needed - RLS ensures we only get our own deletions
        setBookmarks((current) => {
          const newList = current.filter(b => b.id !== deletedId)
          console.log('Updated list length:', newList.length)
          return newList
        })
      }
    )
    .subscribe((status) => {
      console.log('📡 Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully connected to realtime')
      }
    })

  return () => {
    console.log('🧹 Cleaning up subscription')
    channel.unsubscribe()
  }
}, [user.id, supabase])

  const fetchBookmarks = async () => {
    console.log('📥 Fetching bookmarks...')
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching bookmarks:', error)
    } else {
      console.log('✅ Fetched bookmarks:', data?.length)
      setBookmarks(data || [])
    }
  }

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    setLoading(true)
    console.log('📤 Adding bookmark...')
    
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          title: title.trim(),
          url: url.trim(),
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding bookmark:', error)
    } else {
      console.log('✅ Bookmark added:', data)
      // Optimistic update for current tab
      setBookmarks((current) => {
        const exists = current.some(b => b.id === data.id)
        if (!exists) {
          return [data, ...current]
        }
        return current
      })
    }

    setTitle('')
    setUrl('')
    setLoading(false)
  }

  const deleteBookmark = async (id: string) => {
    console.log('🗑️ Deleting bookmark:', id)
    
    // Optimistic update
    setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id))
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this bookmark
    
    if (error) {
      console.error('❌ Error deleting bookmark:', error)
      // Revert on error
      fetchBookmarks()
    } else {
      console.log('✅ Bookmark deleted')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                My Bookmarks
              </h1>
              <p className="text-gray-600">
                Signed in as {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Bookmark
          </h2>
          <form onSubmit={addBookmark} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter bookmark title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Bookmark'}
            </button>
          </form>
        </div>

        {/* Bookmarks List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Bookmarks ({bookmarks.length})
          </h2>
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No bookmarks yet. Add your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 truncate block"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="ml-4 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}