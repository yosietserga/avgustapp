'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryId, setCountryId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, countryId: parseInt(countryId) }),
    });

    if (response.ok) {
      router.push('/users');
    } else {
      alert('Error adding user');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="countryId" className="block mb-2">Country ID:</label>
          <input
            type="number"
            id="countryId"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add User
        </button>
      </form>
    </div>
  );
}