import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    countryId?: number
  }

  interface Session {
    user: {
      id: string
      role: string
      countryId?: number
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    countryId?: number
  }
}