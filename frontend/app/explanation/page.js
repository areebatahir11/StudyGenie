'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ExplanationPage() {
  const router = useRouter()
  
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('studyResult') : null
  const data = stored ? JSON.parse(stored) : null

  useEffect(() => {
    if (!data) router.push('/study')
  }, [])

  const handleNotes = () => router.push('/notes')

  const handleQuiz = (type) => {
    sessionStorage.setItem('quizType', type)
    router.push('/quiz')
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧞</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <button onClick={() => router.push('/study')} className="text-sm text-gray-500 hover:text-violet-600 transition">
          ← New Topic
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-violet-100 text-violet-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {data.level}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{data.topic}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📖</span>
            <h3 className="text-lg font-bold text-gray-700">Explanation</h3>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
            {data.explanation}
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mb-4">What would you like to do next?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button onClick={handleNotes} className="bg-white border-2 border-violet-200 hover:border-violet-500 rounded-2xl p-6 text-center transition group">
            <div className="text-4xl mb-3">📝</div>
            <h4 className="font-bold text-gray-700 group-hover:text-violet-600">Get Notes</h4>
            <p className="text-xs text-gray-400 mt-1">Formatted & downloadable</p>
          </button>

          <button onClick={() => handleQuiz('mcq')} className="bg-white border-2 border-violet-200 hover:border-violet-500 rounded-2xl p-6 text-center transition group">
            <div className="text-4xl mb-3">🧠</div>
            <h4 className="font-bold text-gray-700 group-hover:text-violet-600">MCQ Quiz</h4>
            <p className="text-xs text-gray-400 mt-1">5 multiple choice questions</p>
          </button>

          <button onClick={() => handleQuiz('short')} className="bg-white border-2 border-violet-200 hover:border-violet-500 rounded-2xl p-6 text-center transition group">
            <div className="text-4xl mb-3">✍️</div>
            <h4 className="font-bold text-gray-700 group-hover:text-violet-600">Short Answer</h4>
            <p className="text-xs text-gray-400 mt-1">5 written answer questions</p>
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => router.push('/history')} className="text-sm text-gray-400 hover:text-violet-600 transition">
            📚 View Study History
          </button>
        </div>
      </div>
    </div>
  )
}