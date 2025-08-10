'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  // State to store what the user types into the form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Next.js hook for redirecting the user
  const router = useRouter();

  // This function runs when the user clicks the "Login" button
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading on submit
    setError('');

    try {
      // Send the username and password to the backend API
      const response = await axios.post('http://localhost:3000/auth/signin', {
        username,
        password,
      });

      // If login is successful, the backend sends back an accessToken
      if (response.data.accessToken) {
        // Store the token in the browser's local storage for future use
        localStorage.setItem('accessToken', response.data.accessToken);
        // Redirect the user to the main dashboard page
        router.push('/'); 
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">
          Front Desk Login
        </h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}