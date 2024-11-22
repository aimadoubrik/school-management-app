import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Mail, Phone, Globe, MapPin, Building, Check, X, Calendar } from 'lucide-react';
import avatar from '../../assets/avatar.png';
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserField,
} from '../../features/userProfile/profileSlice';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedUserId = JSON.parse(
      localStorage.getItem('user') || sessionStorage.getItem('user')
    )?.id;
    if (storedUserId) {
      dispatch(fetchUserProfile(storedUserId));
    }
  }, [dispatch]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateUserField({ photo: reader.result }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUserField({ [name]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(user)).unwrap();
      setIsEditing(false);
      setIsDirty(false);
      showNotification('Profile updated successfully');
    } catch (error) {
      showNotification('Error saving profile', 'error');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 rounded-t-md">
      <div className="relative bg-primary h-60 overflow-hidden rounded-t-md"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
        {notification && (
          <div className="fixed top-24 right-4 transition-opacity duration-300 transform -translate-x-1/2 z-50">
            <div
              className={`alert alert-sm ${notification.type === 'error' ? 'alert-error' : 'alert-success'} shadow-lg`}
            >
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="relative p-6 pb-0">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
                      <img
                        src={user?.photo || avatar}
                        alt="Profile"
                        className={`object-cover ${isLoading ? 'opacity-50' : ''}`}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="space-y-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={user?.name || ''}
                        onChange={handleChange}
                        className="input input-bordered w-full max-w-xs text-2xl font-bold"
                        placeholder="Your name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{user?.name}</h2>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <div className="badge badge-primary gap-1">
                        <Building className="w-3 h-3" />
                        {user?.role || 'Member'}
                      </div>
                      <div className="badge badge-ghost gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user?.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-ghost btn-sm gap-2"
                        onClick={() => {
                          setIsEditing(false);
                          setIsDirty(false);
                        }}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm gap-2"
                        onClick={handleSave}
                        disabled={!isDirty || isLoading}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="divider mt-0 mb-0"></div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { icon: Mail, label: 'Email', value: user?.email, name: 'email', type: 'email' },
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: user?.phoneNumber,
                    name: 'phoneNumber',
                    type: 'tel',
                  },
                  { icon: MapPin, label: 'Location', value: user?.address?.city, name: 'address' },
                  {
                    icon: Globe,
                    label: 'Website',
                    value: user?.website,
                    name: 'website',
                    type: 'url',
                  },
                ].map(({ icon: Icon, label, value, name, type }) => (
                  <div key={name} className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">{label}</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-5 h-5 text-base-content/50" />
                      </div>
                      {isEditing ? (
                        <input
                          type={type || 'text'}
                          name={name}
                          value={value || ''}
                          onChange={handleChange}
                          className="input input-bordered w-full pl-10"
                          placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                      ) : (
                        <div className="input input-bordered w-full pl-10 flex items-center bg-base-200/50">
                          {value || <span className="text-base-content/50">Not specified</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Biography</span>
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user?.bio || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                ) : (
                  <p className="textarea textarea-bordered bg-base-200/50 w-full h-auto p-4">
                    {user?.bio || <span className="text-base-content/50">No bio available</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
