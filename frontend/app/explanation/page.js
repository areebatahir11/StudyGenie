'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const formatText = (text) => {
  if (!text) return null
  
  return text.split('\n').map((line, i) => {
    // Skip === or --- lines
    if (/^[=\-]{3,}$/.test(line.trim())) return null
    
    // ## Heading
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-2xl font-bold text-violet-700 mt-8 mb-3">{line.replace('## ', '')}</h2>
    }
    // ### Subheading
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-lg font-bold text-gray-700 mt-5 mb-2">{line.replace('### ', '')}</h3>
    }
    // **heading** alone on line (bold title)
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      return <h3 key={i} className="text-lg font-bold text-violet-600 mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>
    }
    // Bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const content = line.replace(/^[*-] /, '')
      return (
        <div key={i} className="flex gap-3 my-1.5 ml-2">
          <span className="text-violet-400 mt-1 shrink-0">▸</span>
          <p className="text-gray-600 text-sm leading-relaxed">{renderInline(content)}</p>
        </div>
      )
    }
    // Empty line
    if (line.trim() === '') return <div key={i} className="h-3" />
    // Normal paragraph
    return <p key={i} className="text-gray-600 text-sm leading-relaxed my-1">{renderInline(line)}</p>
  })
}

const renderInline = (text) => {
  // Bold **text**
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-gray-800">{part}</strong>
      : part
  )
}

export default function ExplanationPage() {
  const router = useRouter()

  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('studyResult') : null
  const data = stored ? JSON.parse(stored) : null

  useEffect(() => {
    if (!data) router.push('/study')
  }, [])

  const handleQuiz = (type) => {
    sessionStorage.setItem('quizType', type)
    router.push('/quiz')
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-purple-50">

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-violet-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👩‍🏫</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <button onClick={() => router.push('/study')} className="text-sm text-gray-500 hover:text-violet-600 transition flex items-center gap-1">
          ← New Topic
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero Header */}
        <div className="mb-8 text-center">
          <span className="inline-block bg-violet-100 text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-4 capitalize">
            {data.level} Level
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800 capitalize leading-tight">
            {data.topic}
          </h2>
        </div>

        {/* Explanation Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 overflow-hidden mb-8">
          {/* Card Header */}
          <div className="bg-linear-to-r from-violet-600 to-purple-600 px-8 py-5 flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="text-white font-bold text-lg">Explanation</h3>
              <p className="text-violet-200 text-xs">AI-generated for your level</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6">
            {formatText(data.explanation)}
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mb-4">
          <p className="text-center text-gray-400 text-sm font-medium mb-5">✨ What would you like to do next?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Notes */}
            <button
              onClick={() => router.push('/notes')}
              className="group bg-white border-2 border-gray-100 hover:border-violet-400 rounded-2xl p-6 text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-violet-50 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <span className="text-3xl">📝</span>
              </div>
              <h4 className="font-bold text-gray-700 group-hover:text-violet-600 mb-1">Get Notes</h4>
              <p className="text-xs text-gray-400">Formatted & downloadable</p>
            </button>

            {/* MCQ */}
            <button
              onClick={() => handleQuiz('mcq')}
              className="group bg-white border-2 border-gray-100 hover:border-violet-400 rounded-2xl p-6 text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-violet-50 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <span className="text-3xl">🧠</span>
              </div>
              <h4 className="font-bold text-gray-700 group-hover:text-violet-600 mb-1">MCQ Quiz</h4>
              <p className="text-xs text-gray-400">5 multiple choice questions</p>
            </button>

            {/* Short Answer */}
            <button
              onClick={() => handleQuiz('short')}
              className="group bg-white border-2 border-gray-100 hover:border-violet-400 rounded-2xl p-6 text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-violet-50 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <span className="text-3xl">✍️</span>
              </div>
              <h4 className="font-bold text-gray-700 group-hover:text-violet-600 mb-1">Short Answer</h4>
              <p className="text-xs text-gray-400">5 written questions</p>
            </button>

          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => router.push('/history')} className="text-sm text-gray-400 hover:text-violet-500 transition">
            📚 View Study History
          </button>
        </div>
      </div>
    </div>
  )
}