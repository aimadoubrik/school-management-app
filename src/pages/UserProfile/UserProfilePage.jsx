import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Globe, MapPin, Menu, X, Home, Settings, User, Bell, LogOut } from 'lucide-react';
import avatar from '../../assets/avatar.png';

function UserProfilePage() {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const newPhotoUrl = URL.createObjectURL(file);
      setTimeout(() => {
        const updatedUser = { ...user, photo: newPhotoUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsDirty(true);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [name]: value };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
    setIsDirty(false);
  };

  const handleCancel = () => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : initialUser);
    setIsEditing(false);
    setIsDirty(false);
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

  const ProfileField = ({ icon: Icon, label, value, name, type = "text" }) => (
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
            type={type}
            name={name}
            value={value}
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
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="btn btn-circle btn-ghost"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Profile Summary */}
          <div className="p-6 border-b border-base-200">
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={avatar} alt="Profile" />
                </div>
              </div>
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-base-content/70">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink
              icon={Home}
              label="Dashboard"
              isActive={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <SidebarLink
              icon={User}
              label="Profile"
              isActive={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <SidebarLink
              icon={Bell}
              label="Notifications"
              isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            <SidebarLink
              icon={Settings}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-base-200">
            <button className="btn btn-outline w-full gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

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
                      <img src={avatar} alt="Profile" />
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
                  value={user?.phone || ''}
                  type="tel"
                />
                <ProfileField
                  icon={MapPin}
                  label="Address"
                  name="address"
                  value={user?.address || ''}
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

