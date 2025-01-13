import React, { useState } from 'react';

interface RegistrationFormProps {
  onSubmit: (data: { registerNumber: string; name: string; sessionId: string }) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerNumber.trim() && name.trim() && sessionId.trim()) {
      onSubmit({ registerNumber, name, sessionId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#BE185D]/20 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
          Welcome to HR Interview
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sessionId" className="block text-sm font-medium text-gray-300 mb-2">
              Session ID
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
              required
              placeholder="Enter your session ID"
            />
          </div>
          <div>
            <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-300 mb-2">
              Register Number
            </label>
            <input
              type="text"
              id="registerNumber"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
              required
              placeholder="Enter your register number"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
              required
              placeholder="Enter your full name"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-lg hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300"
          >
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
}; 