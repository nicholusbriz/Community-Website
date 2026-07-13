// app/join/page.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth/useAuth"  // ✅ Use useAuth directly
import { Mail, GitFork } from 'lucide-react'
import Link from "next/link"
import { SignupForm } from "@/components/SignupForm"

export default function JoinPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { actions } = useAuth()  // ✅ Get actions from useAuth

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

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
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Join Tech Rise Africa</h1>
        <p className="mt-2 text-gray-600">Create your account and start building</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => actions.signInWithGoogle()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Mail className="h-5 w-5" />
            Continue with Google
          </button>
          <button
            onClick={() => actions.signInWithGitHub()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <GitFork className="h-5 w-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <SignupForm />

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0070f3] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}