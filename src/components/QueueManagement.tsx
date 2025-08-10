'use client';

    import { useState, useEffect, FormEvent } from 'react';
    import api from '@/lib/api';

    type Patient = { id: number; name: string; queueNumber: number; status: string; arrivalTime: string; };
    const statusOptions = ['Waiting', 'With Doctor', 'Completed'];

    export default function QueueManagement() {
      const [patients, setPatients] = useState<Patient[]>([]);
      const [newPatientName, setNewPatientName] = useState('');

      const fetchPatients = async () => {
        try {
          const response = await api.get('/queue');
          setPatients(response.data);
        } catch (error) { console.error("Failed to fetch queue:", error); }
      };

      useEffect(() => { fetchPatients(); }, []);

      const handleAddPatient = async (e: FormEvent) => {
        e.preventDefault();
        if (!newPatientName.trim()) return;
        await api.post('/queue', { name: newPatientName });
        setNewPatientName('');
        fetchPatients();
      };

      const handleStatusChange = async (id: number, newStatus: string) => {
        await api.patch(`/queue/${id}/status`, { status: newStatus });
        fetchPatients();
      };

      return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-5">Queue Management</h2>
          <form onSubmit={handleAddPatient} className="flex gap-4 mb-6">
            <input type="text" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} placeholder="Enter patient name" className="flex-grow bg-gray-700 p-3 rounded-lg"/>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-3 px-6 rounded-lg">Add New Patient</button>
          </form>
          <div className="space-y-3">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <div key={patient.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4">{patient.queueNumber}</span>
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-gray-400">Arrival: {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <select value={patient.status} onChange={(e) => handleStatusChange(patient.id, e.target.value)} className="bg-cyan-500 py-1 px-3 rounded-full border-transparent">
                    {statusOptions.map(option => (<option key={option} value={option} className="bg-gray-700">{option}</option>))}
                  </select>
                </div>
              ))
            ) : (<p className="text-gray-400">The queue is currently empty.</p>)}
          </div>
        </div>
      );
    }