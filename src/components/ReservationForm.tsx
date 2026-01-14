import React, { useState } from 'react';
import { trackReservation } from '../lib/analytics';
import { ErrorBoundary } from './ErrorBoundary';

interface ReservationFormProps {
  labels: {
    date: string;
    time: string;
    guests: string;
    name: string;
    email: string;
    phone: string;
    requests: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  messages: {
    urgency: string;
    cancellation: string;
  };
}

function ReservationFormContent({ labels, messages }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    requests: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Basic validation simulation
    if (formData.name && formData.email && formData.date && formData.time) {
      setStatus('success');
      trackReservation();
    } else {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-lg mx-auto p-8 bg-alabaster rounded-sm border border-charcoal/10 text-center animate-[fadeIn_0.5s_ease-out]">
        <div className="w-16 h-16 bg-charcoal text-alabaster rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-charcoal mb-4">Confirmed</h3>
        <p className="text-charcoal/80 mb-6">{labels.success}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs uppercase tracking-widest border-b border-charcoal/40 hover:border-charcoal text-charcoal/60 hover:text-charcoal transition-all"
        >
          Make another reservation
        </button>
      </div>
    );
  }

  // Generate time slots (5:00 PM - 10:00 PM)
  const timeSlots = [
    '5:00 PM',
    '5:15 PM',
    '5:30 PM',
    '5:45 PM',
    '6:00 PM',
    '6:15 PM',
    '6:30 PM',
    '6:45 PM',
    '7:00 PM',
    '7:15 PM',
    '7:30 PM',
    '7:45 PM',
    '8:00 PM',
    '8:15 PM',
    '8:30 PM',
    '8:45 PM',
    '9:00 PM',
    '9:15 PM',
    '9:30 PM',
    '9:45 PM',
    '10:00 PM',
  ];

  return (
    <form id="reservation-form" onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Date */}
        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.date}
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-serif text-charcoal"
          />
        </div>

        {/* Time */}
        <div className="flex flex-col">
          <label
            htmlFor="time"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.time}
          </label>
          <div className="relative">
            <select
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-serif text-charcoal appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select time
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <label
            htmlFor="guests"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.guests}
          </label>
          <div className="relative">
            <select
              id="guests"
              name="guests"
              required
              value={formData.guests}
              onChange={handleChange}
              className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-serif text-charcoal appearance-none cursor-pointer"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                </option>
              ))}
              <option value="13+">13+ (Call us)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-sans text-charcoal placeholder:text-charcoal/30"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-sans text-charcoal placeholder:text-charcoal/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Phone */}
        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 555-5555"
            className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-sans text-charcoal placeholder:text-charcoal/30"
          />
        </div>

        {/* Requests */}
        <div className="flex flex-col">
          <label
            htmlFor="requests"
            className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 font-medium"
          >
            {labels.requests}
          </label>
          <textarea
            id="requests"
            name="requests"
            value={formData.requests}
            onChange={handleChange}
            rows={1}
            placeholder="Allergies, special occasions..."
            className="w-full bg-white border border-charcoal/20 px-4 py-3 rounded-sm focus:border-charcoal focus:outline-none transition-colors font-sans text-charcoal placeholder:text-charcoal/30 resize-none h-[50px]"
          />
        </div>
      </div>

      {/* Trust & Urgency */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-sm text-charcoal/60 gap-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-amber-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-amber-900/80 font-medium italic">{messages.urgency}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{messages.cancellation}</span>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-charcoal text-alabaster px-10 py-4 text-sm uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto min-w-[200px]"
        >
          {status === 'submitting' ? labels.submitting : labels.submit}
        </button>
      </div>

      {status === 'error' && (
        <div className="mt-4 text-red-600 text-sm text-center">{labels.error}</div>
      )}
    </form>
  );
}

export default function ReservationForm(props: ReservationFormProps) {
  return (
    <ErrorBoundary context="ReservationForm">
      <ReservationFormContent {...props} />
    </ErrorBoundary>
  );
}
