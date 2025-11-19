// client/src/components/Toast.jsx
import React, { useEffect } from 'react';

export default function Toast({ show, text, onClose = () => {} }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-black/90 text-white px-4 py-2 rounded-lg shadow-lg">
        {text}
      </div>
    </div>
  );
}
