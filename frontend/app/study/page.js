'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

export default function StudyPage() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    getUser()
  }, [])

  const handleStudy = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/explain`,
        { topic, level },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      // Result ko localStorage ki jagah sessionStorage mein save karo
      sessionStorage.setItem('studyResult', JSON.stringify({
        topic,
        level,
        explanation: response.data.explanation,
        session_id: response.data.session_id
      }))
      router.push('/explanation')
    } catch (err) {
      alert('Error! Check if backend is running.')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const suggestions = ['Python loops', 'World War 2', 'Photosynthesis', 'Machine Learning', 'Algebra basics', 'Newton Laws']

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👩‍🏫</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/history')} className="text-sm text-gray-500 hover:text-violet-600 transition">
            📚 History
          </button>
          <button onClick={handleLogout} className="text-sm bg-red-50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            What do you want to <span className="text-violet-600">learn</span> today?
          </h2>
          <p className="text-gray-400">Type any topic and get instant AI explanation</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <input
            type="text"
            placeholder="e.g. Python loops, Photosynthesis, World War 2..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStudy()}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 mb-4 text-gray-700"
          />

          {/* Level Selector */}
          <div className="flex gap-2 mb-5">
            <span className="text-sm text-gray-500 self-center mr-1">Level:</span>
            {[
              { value: 'beginner', emoji: '🌱' },
              { value: 'intermediate', emoji: '🔥' },
              { value: 'advanced', emoji: '🚀' }
            ].map(l => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  level === l.value
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {l.emoji} {l.value}
              </button>
            ))}
          </div>

          <button
            onClick={handleStudy}
            disabled={loading || !topic.trim()}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition disabled:opacity-50 text-base"
          >
            {loading ? '✨ Generating explanation...' : '🚀 Generate Explanation'}
          </button>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs text-gray-400 mb-3 text-center">Try these topics</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg hover:border-violet-400 hover:text-violet-600 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}