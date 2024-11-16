import PropTypes from 'prop-types';

const UserProfile = ({ name, role, profilePhoto }) => {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="profile-photo">
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={profilePhoto} alt={`${name}'s profile`} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-sm text-base-content/60 truncate">{role}</p>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  profilePhoto: PropTypes.string.isRequired,
};

export default UserProfile;
