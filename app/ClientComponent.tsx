'use client';
import Link from 'next/link'
import { Globe, Sprout, User2 } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from '@/components/form/login';
import { Button } from "@/components/ui/button";

export default function ClientComponent() {
  const { data: session, status } = useSession();

  const handleLogin = async (email: string, password: string, token?: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      token,
    });

    if (result?.error) {
      console.error(result.error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-100 to-green-100">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">Agricultural Management System</h1>
      
      {!session || session ? (
        <>
          <p className="mb-6">Welcome, {session.user.name || session.user.email}!</p>
          {session.user.role === 'superadmin' && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Superadmin Dashboard</h2>
              {/* Add superadmin-specific links or components */}
            </div>
          )}
          <div className="flex space-x-12 mb-8">
            <Link href="/pais" className="flex flex-col items-center group">
              <div className="bg-blue-500 p-6 rounded-full transition-all duration-300 group-hover:bg-blue-600">
                <Globe className="h-16 w-16 text-white" />
              </div>
              <span className="mt-4 text-xl font-semibold text-gray-800 group-hover:text-blue-600">Countries</span>
            </Link>
            <Link href="/cultivos" className="flex flex-col items-center group">
              <div className="bg-green-500 p-6 rounded-full transition-all duration-300 group-hover:bg-green-600">
                <Sprout className="h-16 w-16 text-white" />
              </div>
              <span className="mt-4 text-xl font-semibold text-gray-800 group-hover:text-green-600">Crops</span>
            </Link>
            <Link href="/users" className="flex flex-col items-center group">
              <div className="bg-red-500 p-6 rounded-full transition-all duration-300 group-hover:bg-green-600">
                <User2 className="h-16 w-16 text-white" />
              </div>
              <span className="mt-4 text-xl font-semibold text-gray-800 group-hover:text-green-600">Users</span>
            </Link>
          </div>
          <Button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white">
            Sign out
          </Button>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </main>
  )
}