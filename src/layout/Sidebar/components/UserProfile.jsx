import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const userId =
    (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).id) ||
    null;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3000/users');
          const user = response.data.find((u) => u.id === userId);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>; // Optionally, you can display a loader or placeholder
  }
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="profile-photo">
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={userData.photo || 'path/to/default/avatar'}
            alt={`${userData.name}'s profile`}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{userData.name}</p>
        <p className="text-sm text-base-content/60 truncate">{userData.role}</p>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  avatar: PropTypes.string,
};

export default UserProfile;
