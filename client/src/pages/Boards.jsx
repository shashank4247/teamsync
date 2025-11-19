// client/src/pages/Boards.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/auth';

export default function Boards() {
  const nav = useNavigate();
  const logout = () => {
    setAuthToken(null);
    nav('/login');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Boards (placeholder)</h2>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
      <p className="text-sm text-gray-600">This will later list your boards. For now auth works if you reached here.</p>
    </div>
  );
}
