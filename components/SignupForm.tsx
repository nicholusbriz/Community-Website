// components/SignupForm.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth/useAuth"
import { Eye, EyeOff } from "lucide-react"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { actions } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Client-side validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      await actions.signInWithCredentials(email, password, 'signup', name)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
          required
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
          required
          placeholder="you@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20"
            required
            minLength={6}
            placeholder="Minimum 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#0070f3] py-3 font-semibold text-white transition-colors hover:bg-[#0070f3]/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}