'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  countryId: number;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <Link href="/users/add" className="bg-green-500 text-white px-4 py-2 rounded">
        Add New User
      </Link>
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.countryId}</td>
              <td>
                <button
                  onClick={() => router.push(`/users/edit/${user.id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}