// app/lib/auth/config.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import { UserRole } from "./roles"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create Prisma adapter
const prismaAdapter = new PrismaPg(pool)

// Create PrismaClient with adapter
const prisma = new PrismaClient({
  adapter: prismaAdapter,
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const { email, password, name, action } = credentials

        if (action === "signup") {
          if (!name) {
            throw new Error("Name is required for signup")
          }

          const existingUser = await prisma.user.findUnique({
            where: { email }
          })

          if (existingUser) {
            throw new Error("User already exists. Please login.")
          }

          const hashedPassword = await bcrypt.hash(password, 10)
          
          const userRole = await prisma.role.findUnique({
            where: { name: 'USER' }
          })
          
          if (!userRole) {
            throw new Error("USER role not found in database. Please run seed first.")
          }

          const user = await prisma.user.create({
            data: {
              email,
              name,
              password: hashedPassword,
              roleId: userRole.id,
            },
            include: {
              role: true
            }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            roleId: user.roleId,
          }
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            role: true
          }
        })

        if (!user) {
          throw new Error("User not found. Please sign up.")
        }

        if (!user.password) {
          throw new Error("Account uses OAuth. Please sign in with Google or GitHub.")
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          roleId: user.roleId,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      if (trigger === 'update' && session) {
        token.name = session.user?.name
        token.email = session.user?.email
        token.image = session.user?.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string | null
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // ✅ Handle OAuth sign in - ensure email exists
      if (account?.provider === 'google' || account?.provider === 'github') {
        // ✅ Check if email exists
        if (!user.email) {
          console.error('❌ No email provided by OAuth provider')
          return false
        }

        // Check if user exists by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        // If user exists, link the OAuth account
        if (existingUser) {
          return true
        }

        // If user doesn't exist, create a new user with OAuth data
        const userRole = await prisma.role.findUnique({
          where: { name: 'USER' }
        })

        if (!userRole) {
          console.error('❌ USER role not found in database')
          return false
        }

        try {
          // ✅ Create user with OAuth data - ensure email is a string
          const newUser = await prisma.user.create({
            data: {
              email: user.email, // ✅ Now guaranteed to be a string
              name: user.name || profile?.name || null,
              image: user.image || null,
              roleId: userRole.id,
            }
          })

          // Update user.id to the new user's id
          user.id = newUser.id
        } catch (error) {
          console.error('❌ Error creating user from OAuth:', error)
          return false
        }
      }

      return true
    }
  },
  pages: {
    signIn: "/join",
    error: "/join",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// ✅ Create the NextAuth handler
const handler = NextAuth(authOptions)

// ✅ Export the handler methods for the API route
export const GET = handler.GET
export const POST = handler.POST

// ✅ IMPORTANT: Export auth for server-side use
export const auth = handler.auth

// ✅ Export the handler itself for other uses
export { handler }