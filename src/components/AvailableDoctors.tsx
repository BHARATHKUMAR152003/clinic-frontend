'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

type Doctor = { id: number; name: string; specialization: string };
type Appointment = { id: number; patientName: string; appointmentTime: string; status: string };

export default function AvailableDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [schedule, setSchedule] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        if (response.data) setDoctors(response.data);
      } catch (error) { console.error("Failed to fetch doctors:", error); }
      finally { setLoading(false); }
    };
    fetchDoctors();
  }, []);

  // Function to handle clicking the "View Schedule" button
  const handleViewSchedule = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    try {
      const response = await api.get(`/appointments/doctor/${doctor.id}`);
      setSchedule(response.data);
    } catch (error) { console.error("Failed to fetch schedule:", error); }
    setIsModalOpen(true);
  };

  if (loading) { return <p className="text-white">Loading...</p>; }

  return (
    <>
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-5">Available Doctors</h2>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm text-gray-400">{doctor.specialization}</p>
              </div>
              <button
                onClick={() => handleViewSchedule(doctor)}
                className="text-sm bg-gray-700 hover:bg-gray-600 py-1 px-3 rounded-md"
              >
                View Schedule
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Schedule for {selectedDoctor.name}</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {schedule.length > 0 ? (
                schedule.map(appt => (
                  <div key={appt.id} className="bg-gray-700 p-3 rounded-md">
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-gray-400">Time: {new Date(appt.appointmentTime).toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Status: {appt.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No appointments scheduled for this doctor.</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}