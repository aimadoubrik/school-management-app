import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, Mail, Phone, Globe, MapPin, Menu, X, Home, Settings, User, Bell, LogOut } from 'lucide-react';
import avatar from '../../assets/avatar.png';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Fetch all users and set the current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const allUsers = response.data;
        const storedUserId =
          (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) ||
          (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) ||
          null;
        const currentUser = allUsers.find((user) => user.id === storedUserId.id);
        
        // Ensure all required fields exist
        const normalizedUser = {
          ...currentUser,
          phoneNumber: currentUser?.phoneNumber || '',
          address: {
            city: currentUser?.address?.city || '',
            ...(currentUser?.address || {})
          },
          website: currentUser?.website || '',
          bio: currentUser?.bio || ''
        };
        
        setUser(normalizedUser);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      // This `reader.result` will be a base64-encoded image string
      const base64Image = reader.result;
  
      // Update user state and persist image as base64 string
      const updatedUser = { ...user, photo: base64Image };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsDirty(true);
      setIsLoading(false);
    };
  
    reader.readAsDataURL(file);
  };
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      let updatedUser = { ...prevUser };

      // Handle nested address object
      if (name === 'address') {
        updatedUser.address = {
          ...updatedUser.address,
          city: value
        };
      }
      // Handle phone number field
      else if (name === 'phone') {
        updatedUser.phoneNumber = value;
      }
      // Handle all other fields
      else {
        updatedUser[name] = value;
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      setIsDirty(false);
      setFocusedField(null);
    } catch (error) {
      console.error('Error saving the profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setIsEditing(false);
    setIsDirty(false);
    setFocusedField(null);
  };

  const SidebarLink = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
        ${isActive ? 'bg-base-200 text-primary font-medium' : 'hover:bg-base-200 text-base-content'}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
  const handleSharedBlur = () => {
    // Only clear focused field if we're not clicking another input
    setTimeout(() => {
      if (document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        setFocusedField(null);
      }
    }, 0);
  };

  const ProfileField = ({ icon: Icon, label, value, name, type = "text" }) => {
    const inputRef = useRef(null);
    
    useEffect(() => {
      if (isEditing && focusedField === name && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing, focusedField, name]);

    const handleFocus = () => {
      setFocusedField(name);
    };

    return (
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-base-content/50" />
          </div>
          {isEditing && name !== 'role' ? (
            <input
              ref={inputRef}
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleSharedBlur}
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
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-base-100 bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                  )}
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user?.photo || avatar} alt="Profile" />
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

                <div className="flex-1 text-center sm:text-left space-y-2">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={user?.name || ''}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={handleSharedBlur}
                        className="input input-bordered w-full max-w-xs text-xl"
                        placeholder="Full Name"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <p className="text-base-content/70">{user?.role}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                        onClick={handleSave}
                        disabled={!isDirty || isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={Mail}
                  label="Email"
                  name="email"
                  value={user?.email || ''}
                  type="email"
                />
                <ProfileField
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  value={user?.phoneNumber || ''}
                  type="tel"
                />
                <ProfileField
                  icon={MapPin}
                  label="Address"
                  name="address"
                  value={user?.address?.city || ''}
                />
                <ProfileField
                  icon={Globe}
                  label="Website"
                  name="website"
                  value={user?.website || ''}
                  type="url"
                />
                <div className="md:col-span-2 form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={user?.bio || ''}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('bio')}
                      onBlur={handleSharedBlur}
                      rows="4"
                      className="textarea textarea-bordered w-full"
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <div className="textarea textarea-bordered bg-base-200/50">
                      {user?.bio || <span className="text-base-content/50">No bio provided</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;