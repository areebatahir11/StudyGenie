//frontend/app/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('✅ Account created! Please login.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/study')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side — Illustration */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-violet-600 to-purple-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        
        {/* Background circles */}
        <div className="absolute -top-15 -left-15 w-64 h-64 bg-white opacity-5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-8">👩‍🏫</div>
          <h1 className="text-4xl font-bold text-white mb-4">StudyGenie</h1>
          <p className="text-violet-200 text-lg mb-8 leading-relaxed">
            Your AI-powered study assistant.<br />
            Learn smarter, not harder.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 text-left">
            {[
              { icon: '📖', text: 'AI Explanations in your level' },
              { icon: '📝', text: 'Smart formatted notes' },
              { icon: '🧠', text: 'MCQ & Short answer quizzes' },
              { icon: '📊', text: 'Track your progress' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl px-4 py-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-purple text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🧞</span>
            <h1 className="text-2xl font-bold text-violet-600 mt-2">StudyGenie</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {isSignup ? 'Join thousands of smart learners' : 'Continue your learning journey'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              />
            </div>
          </div>

          {error && (
            <p className={`text-sm mt-3 ${error.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
              {error}
            </p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account →' : 'Login →'}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <span
              onClick={() => { setIsSignup(!isSignup); setError('') }}
              className="text-violet-600 font-semibold cursor-pointer ml-1 hover:underline"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}