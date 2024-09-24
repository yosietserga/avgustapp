'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUser({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryId, setCountryId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await fetch(`/api/users/${params.id}`);
    const user = await response.json();
    setName(user.name);
    setEmail(user.email);
    setCountryId(user.countryId.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/users/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, countryId: parseInt(countryId) }),
    });

    if (response.ok) {
      router.push("/users");
    } else {
      alert("Error updating user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
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
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
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
          <label htmlFor="countryId" className="block mb-2">
            Country ID:
          </label>
          <input
            type="number"
            id="countryId"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update User
        </button>
      </form>
    </div>
  );
}