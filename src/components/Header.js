import React, { useState, useEffect } from 'react';
import { getUser } from "../idb";

function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState([{firstName:"Usuario"}]);

  const checkRegistration = async () => {
    const user = await getUser(); // Usamos la función getUser
    if (user.length>0) {
      setUser(user)
    } 
  };

  useEffect(() => {

    checkRegistration()
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
    <header className={`p-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-center shadow-md`}>
  <div className="flex justify-between items-center px-4">
    <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
      {isOnline ? 'Estás Online' : 'Estás Offline'}
    </h1>
    <p className="text-sm text-right font-light">
      Bienvenido, <span className="font-medium">{user[0].firstName.split(" ")[0] || "Usuario"}</span>
    </p>
  </div>
</header>

  
  );
}

export default Header;
