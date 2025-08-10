'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import api from '@/lib/api'; // <-- Import our new API client

type Doctor = {
  id: number;
  name: string;
  specialization: string;
};

type Appointment = {
  id: number;
  patientName: string;
  appointmentTime: string;
  status: string;
  doctor: Doctor;
};

const appointmentStatusOptions = ['Booked', 'Completed', 'Canceled'];

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  const fetchData = async () => {
    try {
      // Use the new 'api' client to make requests
      const apptsResponse = await api.get('/appointments');
      setAppointments(apptsResponse.data);

      const docsResponse = await api.get('/doctors');
      setDoctors(docsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleAppointment = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientName || !selectedDoctorId || !appointmentTime) return;

    await api.post('/appointments', {
      patientName,
      doctorId: parseInt(selectedDoctorId),
      appointmentTime,
    });

    setIsModalOpen(false);
    setPatientName('');
    setSelectedDoctorId('');
    setAppointmentTime('');
    fetchData();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await api.patch(`/appointments/${id}`, { status: newStatus });
    fetchData();
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Appointment Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Schedule New Appointment</button>
      </div>
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{appt.patientName}</p>
                <p className="text-sm text-gray-400">With: {appt.doctor.name}</p>
                <p className="text-sm text-gray-400">Time: {new Date(appt.appointmentTime).toLocaleString()}</p>
              </div>
              <select value={appt.status} onChange={(e) => handleStatusChange(appt.id, e.target.value)} className="bg-purple-500 text-white text-sm font-medium py-1 px-3 rounded-full border-transparent focus:outline-none">
                {appointmentStatusOptions.map(option => (<option key={option} value={option} className="bg-gray-700 text-white">{option}</option>))}
              </select>
            </div>
          ))
        ) : (<p className="text-gray-400">No appointments scheduled.</p>)}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Schedule New Appointment</h3>
            <form onSubmit={handleScheduleAppointment} className="space-y-4">
              <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient Name" className="w-full bg-gray-700 p-3 rounded-lg"/>
              <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg">
                <option value="">Select a Doctor</option>
                {doctors.map((doc) => (<option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>))}
              </select>
              <input type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full bg-gray-700 p-3 rounded-lg"/>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Schedule Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}