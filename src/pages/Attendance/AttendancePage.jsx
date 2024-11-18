import React, { useState, useEffect } from 'react';
import AttendanceFormateur from './AttendanceFormateur';
import AttendanceAdmin from './AttendanceAdmin';

function AttendancePage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || 
                 (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) || 
                 { name: '', role: '' };

    // Ensure role is either 'admin' or 'trainer', fallback to empty string
    if (user && (user.role === 'admin' || user.role === 'trainer')) {
      setCurrentUser(user);
    } else {
      setCurrentUser({ role: '' });
    }
  }, []);

  // Show loading text or component while the user data is being fetched
  if (currentUser === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-5">Gestion d'Absence</h1>

      {currentUser.role === 'admin' ? ( 
        <AttendanceAdmin />
      ) : currentUser.role === 'trainer' ? (
        <AttendanceFormateur />
      ) : (
        <p className="text-center py-4">Role not recognized or missing.</p>
      )}
    </div>
  );
}

export default AttendancePage;
