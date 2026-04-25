'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

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
    const content = `STUDYGENIE - NOTES\n${'='.repeat(50)}\nTopic: ${data.topic}\nLevel: ${data.level}\nDate: ${new Date().toLocaleDateString()}\n${'='.repeat(50)}\n\n${notes}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.topic}-notes.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatNotes = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-violet-700 mt-6 mb-2">{line.replace('## ', '')}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-gray-700 mt-4 mb-1">{line.replace('### ', '')}</h3>
      if (line.startsWith('- ') || line.startsWith('* ')) return (
        <div key={i} className="flex gap-2 my-1">
          <span className="text-violet-400 mt-1">•</span>
          <p className="text-gray-600 text-sm">{line.replace(/^[-*] /, '')}</p>
        </div>
      )
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-gray-600 text-sm my-1">{line}</p>
    })
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧞</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-violet-600">← Back</button>
          {notes && (
            <button onClick={handleDownload} className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition">
              ⬇️ Download Notes
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📝</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{data.topic}</h2>
            <p className="text-gray-400 text-sm">Study Notes</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-4xl mb-4 animate-bounce">📝</div>
            <p className="text-gray-400">Generating your notes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {formatNotes(notes)}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={handleDownload} className="w-full py-3 bg-violet-50 hover:bg-violet-100 text-violet-600 font-semibold rounded-xl transition text-sm">
                ⬇️ Download Notes as Text File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}