'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import axios from 'axios'

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [shortAnswers, setShortAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('studyResult') : null
  const quizType = typeof window !== 'undefined' ? sessionStorage.getItem('quizType') || 'mcq' : 'mcq'
  const data = stored ? JSON.parse(stored) : null

  useEffect(() => {
    if (!data) { router.push('/study'); return }

    const parseQuiz = (text, type) => {
      const qBlocks = text.split(/Q\d+\./).filter(b => b.trim())
      const parsed = qBlocks.map((block, i) => {
        if (type === 'mcq') {
          const lines = block.trim().split('\n').filter(l => l.trim())
          const question = lines[0].trim()
          const options = lines.slice(1).filter(l => /^[A-D]\)/.test(l.trim()))
          const answerLine = lines.find(l => l.toUpperCase().includes('ANSWER:'))
          const correct = answerLine ? answerLine.split(':')[1].trim().charAt(0) : 'A'
          return { id: i, question, options, correct }
        } else {
          const lines = block.trim().split('\n').filter(l => l.trim())
          const question = lines[0].trim()
          const answerLine = lines.find(l => l.toUpperCase().includes('ANSWER:'))
          const answer = answerLine ? answerLine.split(':').slice(1).join(':').trim() : ''
          return { id: i, question, answer }
        }
      })
      setQuestions(parsed)
    }

    const fetchQuiz = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/quiz`,
          { topic: data.topic, quiz_type: quizType },
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        )
        parseQuiz(response.data.quiz, quizType)
      } catch (err) {
        alert('Error fetching quiz!')
      }
      setLoading(false)
    }

    fetchQuiz()
  }, [])

  const handleMCQSelect = (qId, option) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: option }))
  }

  const handleSubmit = async () => {
    let correct = 0
    if (quizType === 'mcq') {
      questions.forEach(q => {
        if (answers[q.id] === q.correct) correct++
      })
      setScore(correct)
    }
    setSubmitted(true)

    if (data?.session_id && quizType === 'mcq') {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/quiz-result`,
          { session_id: data.session_id, score: correct, total: questions.length },
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        )
      } catch (err) { console.error(err) }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🧠</div>
        <p className="text-gray-400">Generating your quiz...</p>
      </div>
    </div>
  )

  const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧞</span>
          <h1 className="text-xl font-bold text-violet-600">StudyGenie</h1>
        </div>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-violet-600">← Back</button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{quizType === 'mcq' ? '🧠' : '✍️'}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{data?.topic}</h2>
            <p className="text-gray-400 text-sm">{quizType === 'mcq' ? 'Multiple Choice Quiz' : 'Short Answer Quiz'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="font-semibold text-gray-700 mb-4">
                <span className="text-violet-600 mr-2">Q{i + 1}.</span>{q.question}
              </p>

              {quizType === 'mcq' ? (
                <div className="space-y-2">
                  {q.options.map((opt, j) => {
                    const letter = opt.trim().charAt(0)
                    const isSelected = answers[q.id] === letter
                    const isCorrect = submitted && letter === q.correct
                    const isWrong = submitted && isSelected && letter !== q.correct
                    return (
                      <button
                        key={j}
                        onClick={() => handleMCQSelect(q.id, letter)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition border-2 ${
                          isCorrect ? 'bg-green-50 border-green-400 text-green-700' :
                          isWrong ? 'bg-red-50 border-red-400 text-red-700' :
                          isSelected ? 'bg-violet-50 border-violet-400 text-violet-700' :
                          'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-300'
                        }`}
                      >
                        {opt.trim()} {isCorrect && '✓'} {isWrong && '✗'}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <textarea
                    placeholder="Write your answer here..."
                    value={shortAnswers[q.id] || ''}
                    onChange={e => setShortAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    disabled={submitted}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none h-24"
                  />
                  {submitted && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-green-600 mb-1">✓ Model Answer:</p>
                      <p className="text-sm text-green-700">{q.answer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={quizType === 'mcq' && Object.keys(answers).length < questions.length}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition disabled:opacity-50"
          >
            Submit Quiz →
          </button>
        ) : (
          <div className={`rounded-2xl p-8 text-center ${
            quizType === 'short' ? 'bg-white border border-gray-100 shadow-sm' :
            percentage >= 80 ? 'bg-linear-to-br from-violet-600 to-purple-700 text-white shadow-lg' :
            percentage >= 60 ? 'bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg' :
            'bg-white border border-gray-200 shadow-sm'
          }`}>
            {quizType === 'mcq' ? (
              <>
                <div className="text-5xl mb-3">{percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '💪'}</div>
                <h3 className={`text-2xl font-bold mb-2 ${percentage < 60 ? 'text-gray-700' : ''}`}>
                  {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Trying!'}
                </h3>
                <p className={`text-4xl font-bold mb-2 ${percentage < 60 ? 'text-violet-600' : ''}`}>{score}/{questions.length}</p>
                <p className={`text-sm mb-6 ${percentage >= 60 ? 'text-white/80' : 'text-gray-400'}`}>{percentage.toFixed(0)}% Score</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => router.push('/study')} className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${percentage >= 60 ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}>
                    Study New Topic
                  </button>
                  <button onClick={() => router.push('/history')} className={`px-6 py-2 rounded-xl text-sm font-semibold transition ${percentage >= 60 ? 'bg-white text-violet-600' : 'bg-gray-100 text-gray-600'}`}>
                    View History
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Quiz Completed!</h3>
                <p className="text-gray-400 text-sm mb-6">Compare your answers with the model answers above</p>
                <button onClick={() => router.push('/study')} className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                  Study New Topic
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}