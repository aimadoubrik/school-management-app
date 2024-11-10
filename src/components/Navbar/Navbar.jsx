import React, { useState } from 'react';
import { 
  Menu, X, Search, Bell, ChevronDown,
  Sun, Moon, MessageSquare, Settings, LogOut 
} from 'lucide-react';

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const notifications = [
    { id: 1, title: 'New course available', time: '5m ago', isUnread: true },
    { id: 2, title: 'Assignment due', time: '1h ago', isUnread: true },
    { id: 3, title: 'System update', time: '2h ago', isUnread: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <nav className="bg-base-100 border-b border-base-200 h-16">
        <div className="max-w-[2000px] mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="btn btn-ghost btn-square"
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <a href="/" className="flex items-center gap-2">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="OFPPT Logo" 
                  className="w-8 h-8"
                />
                <span className="font-bold text-xl hidden sm:inline-block">
                  OFPPT
                </span>
              </a>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-xl px-4">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search..."
                  className="input input-bordered w-full pl-10"
                  onFocus={() => setShowSearchModal(true)}
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <button 
                className="btn btn-ghost btn-circle md:hidden"
                onClick={() => setShowSearchModal(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle">
                  <Sun className="w-5 h-5 hidden dark:block" />
                  <Moon className="w-5 h-5 block dark:hidden" />
                </button>
              </div>

              {/* Notifications */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle indicator">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.isUnread).length > 0 && (
                    <span className="indicator-item badge badge-primary badge-sm">
                      {notifications.filter(n => n.isUnread).length}
                    </span>
                  )}
                </label>
                <div 
                  tabIndex={0} 
                  className="dropdown-content card card-compact w-80 p-2 shadow bg-base-100"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <button className="btn btn-ghost btn-xs">Mark all as read</button>
                    </div>
                    <ul className="space-y-2">
                      {notifications.map(notification => (
                        <li 
                          key={notification.id}
                          className={`flex items-start gap-3 p-2 rounded-lg hover:bg-base-200 
                            ${notification.isUnread ? 'bg-base-200' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-base-content/60">{notification.time}</p>
                          </div>
                          {notification.isUnread && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="card-actions mt-2">
                      <button className="btn btn-ghost btn-block btn-sm">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost flex items-center gap-2 normal-case">
                  <div className="avatar">
                    <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src="/api/placeholder/32/32" alt="Profile" />
                    </div>
                  </div>
                  <span className="hidden sm:inline-block">John Doe</span>
                  <ChevronDown className="w-4 h-4" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a href="/messages" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </a>
                  </li>
                  <li>
                    <a href="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </a>
                  </li>
                  <li>
                    <a href="/logout" className="flex items-center gap-2 text-error">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-base-300/80 flex items-start justify-center pt-24">
          <div className="bg-base-100 w-full max-w-2xl rounded-lg shadow-lg p-4 mx-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="input input-bordered w-full pl-10"
                autoFocus
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-sm text-base-content/60 mb-2">Recent Searches</h3>
              <ul className="space-y-2">
                <li>
                  <button className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg">
                    <Search className="w-4 h-4" />
                    <span>Course Management</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg">
                    <Search className="w-4 h-4" />
                    <span>Student Records</span>
                  </button>
                </li>
              </ul>
            </div>
            <button 
              className="absolute top-4 right-4 btn btn-ghost btn-circle"
              onClick={() => setShowSearchModal(false)}
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;