'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: { session } } = await supabase.auth.getSession()
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/history`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        )
        setHistory(response.data.history)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 to-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-violet-600">👩‍🏫 StudyGenie</h1>
        <button
          onClick={() => router.push('/study')}
          className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded-lg hover:bg-violet-200"
        >
          ← Back to Study
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-700 mb-6">📚 Study History</h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-400">No study sessions yet!</p>
            <button
              onClick={() => router.push('/study')}
              className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-700"
            >
              Start Studying
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-700 capitalize">{item.topic}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Level: <span className="capitalize">{item.level}</span> •{' '}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {item.score !== null ? (
                    <span className="text-sm font-bold text-violet-600">{item.score}/5</span>
                  ) : (
                    <span className="text-xs text-gray-400">No quiz taken</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}