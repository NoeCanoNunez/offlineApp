import React, { useState, useEffect } from 'react';

function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <header className={`p-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-center`}>
      {isOnline ? 'Estás Online' : 'Estás Offline'}
    </header>
  );
}

export default Header;
