'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

const renderInline = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-gray-900">{part}</strong>
      : part
  )
}

const formatNotes = (text) => {
  return text.split('\n').map((line, i) => {
    if (/^[=\-]{3,}$/.test(line.trim())) return null

    if (line.startsWith('## ')) {
      return (
        <div key={i} className="mt-8 mb-3">
          <h2 className="text-xl font-extrabold text-violet-700 border-b-2 border-violet-100 pb-2">
            {line.replace('## ', '')}
          </h2>
        </div>
      )
    }
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-base font-bold text-gray-800 mt-5 mb-2">{line.replace('### ', '')}</h3>
    }
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      return (
        <div key={i} className="mt-6 mb-2">
          <h3 className="text-base font-extrabold text-violet-600">{line.replace(/\*\*/g, '')}</h3>
        </div>
      )
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.replace(/^[*-] /, '')
      return (
        <div key={i} className="flex gap-3 my-2 ml-2">
          <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 shrink-0" />
          <p className="text-gray-600 text-sm leading-relaxed">{renderInline(content)}</p>
        </div>
      )
    }
    if (line.trim() === '') return <div key={i} className="h-3" />
    return <p key={i} className="text-gray-600 text-sm leading-relaxed my-1.5">{renderInline(line)}</p>
  })
}

export default function NotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('studyResult') : null
  const data = stored ? JSON.parse(stored) : null

  useEffect(() => {
    if (!data) { router.push('/study'); return }

    const fetchNotes = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notes`,
          { topic: data.topic, explanation: data.explanation },
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        )
        setNotes(response.data.notes)
      } catch (err) {
        alert('Error fetching notes!')
      }
      setLoading(false)
    }
    fetchNotes()
  }, [])

  const handleDownload = () => {
    const clean = notes.replace(/\*\*/g, '').replace(/^#{1,3} /gm, '')
    const content = `STUDYGENIE — NOTES\n${'='.repeat(50)}\nTopic: ${data.topic}\nLevel: ${data.level}\nDate: ${new Date().toLocaleDateString()}\n${'='.repeat(50)}\n\n${clean}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.topic}-notes.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-violet-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧞</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-violet-600 transition">
            ← Back
          </button>
          {notes && (
            <button
              onClick={handleDownload}
              className="text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition flex items-center gap-1"
            >
              ⬇️ Download
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-violet-100 text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-4 capitalize">
            {data.level} Level
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800 capitalize">{data.topic}</h2>
          <p className="text-gray-400 text-sm mt-2">Study Notes</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-16 text-center">
            <div className="text-5xl mb-4 animate-bounce">📝</div>
            <p className="text-gray-400 font-medium">Generating your notes...</p>
            <p className="text-gray-300 text-sm mt-1">This may take a moment</p>
          </div>
        ) : (
          <>
            {/* Notes Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-violet-100 overflow-hidden mb-6">
              {/* Card Header */}
              <div className="bg-linear-to-r from-violet-600 to-purple-600 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">Study Notes</h3>
                    <p className="text-violet-200 text-xs">AI-generated comprehensive notes</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-xl transition"
                >
                  ⬇️ Download
                </button>
              </div>

              {/* Notes Content */}
              <div className="px-8 py-6">
                {formatNotes(notes)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl transition text-sm"
              >
                ⬇️ Download Notes
              </button>
              <button
                onClick={() => router.back()}
                className="py-3 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-2xl border border-gray-200 transition text-sm"
              >
                ← Back to Explanation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}