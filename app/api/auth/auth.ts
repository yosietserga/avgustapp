import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { SUPERADMIN_TOKEN } from "@/lib/constants";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Superadmin Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check for superadmin token
        if (credentials.token === SUPERADMIN_TOKEN) {
          return {
            id: 'superadmin',
            email: 'superadmin@example.com',
            name: 'Super Admin',
            role: 'superadmin'
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          countryId: user.countryId,
          role: 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.role !== 'superadmin') {
          token.countryId = user.countryId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        if (token.role !== 'superadmin') {
          session.user.countryId = token.countryId as number;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
  },
};