'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [reloading, setReloading] = useState(null)

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

  const handleTopicClick = async (item) => {
    setReloading(item.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/explain`,
        { topic: item.topic, level: item.level },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      sessionStorage.setItem('studyResult', JSON.stringify({
        topic: item.topic,
        level: item.level,
        explanation: response.data.explanation,
        session_id: response.data.session_id
      }))
      router.push('/explanation')
    } catch (err) {
      alert('Error! Please try again.')
    }
    setReloading(null)
  }

  const scoreColor = (score) => {
    if (score === null) return null
    const pct = (score / 5) * 100
    if (pct >= 80) return 'text-green-600 bg-green-50'
    if (pct >= 60) return 'text-blue-600 bg-blue-50'
    return 'text-red-500 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-violet-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧞</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <button
          onClick={() => router.push('/study')}
          className="text-sm bg-violet-50 text-violet-600 px-4 py-2 rounded-xl hover:bg-violet-100 transition"
        >
          ← Back to Study
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">📚 Study History</h2>
          <p className="text-gray-400 text-sm mt-2">Click any topic to re-study it</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-16 text-center">
            <div className="text-4xl animate-bounce mb-3">📚</div>
            <p className="text-gray-400">Loading your history...</p>
          </div>

        ) : history.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-12 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="font-bold text-gray-700 mb-2">No study sessions yet!</h3>
            <p className="text-gray-400 text-sm mb-6">Start learning something new today</p>
            <button
              onClick={() => router.push('/study')}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
            >
              Start Studying
            </button>
          </div>

        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTopicClick(item)}
                disabled={reloading === item.id}
                className="w-full bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-center hover:border-violet-300 hover:shadow-md transition-all group disabled:opacity-60 text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-violet-50 group-hover:bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <span className="text-lg">📖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 group-hover:text-violet-600 capitalize transition-colors">
                      {reloading === item.id ? 'Loading...' : item.topic}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="capitalize">{item.level}</span>
                      {' • '}
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {item.score !== null ? (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${scoreColor(item.score)}`}>
                      {item.score}/5
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
                      No quiz
                    </span>
                  )}
                  <span className="text-gray-300 group-hover:text-violet-400 transition-colors text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}