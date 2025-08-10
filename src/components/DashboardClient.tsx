'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppointmentManagement from '@/components/AppointmentManagement';
import QueueManagement from '@/components/QueueManagement';
import AvailableDoctors from '@/components/AvailableDoctors';

export default function DashboardClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (!isLoggedIn) {
    return <p className="text-white text-center p-8">Redirecting to login...</p>;
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Front Desk Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Log Out
        </button>
      </header>
      <div className="space-y-8">
        <QueueManagement />
        <AppointmentManagement />
        <AvailableDoctors />
      </div>
    </div>
  );
}