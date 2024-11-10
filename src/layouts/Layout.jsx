import React, { useState, useEffect } from 'react';
import {
  Menu, X, Search, Bell, ChevronDown, Sun, Moon,
  MessageSquare, Settings, LogOut, BookOpen, Users,
  Calendar, BarChart, FileText, LayoutDashboard,
  GraduationCap
} from 'lucide-react';

// Layout wrapper component
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        document.getElementById('search-input')?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        isMobile={isMobile}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className={`transition-all duration-300 pt-16
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Improved Navbar with Inline Search
const Navbar = ({ isSidebarOpen, toggleSidebar, searchFocused, setSearchFocused, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Course Management',
    'Student Records',
    'Grade Reports',
    'Class Schedule'
  ]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <nav className="bg-base-100 border-b border-base-200 h-16">
        <div className="max-w-[2000px] mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              {
                isMobile && (
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
                )
              }


              <a href="/" className="btn btn-ghost text-xl flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl hidden sm:inline-block">
                  OFPPT
                </span>
              </a>
            </div>

            {/* Search Section */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative">
                <input
                  id="search-input"
                  type="search"
                  placeholder="Search..."
                  className="input input-bordered w-full pl-10 pr-16 "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    // Small delay to allow clicking on suggestions
                    setTimeout(() => setSearchFocused(false), 200);
                  }}
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchQuery === '' ? (
                    <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] font-medium opacity-60">
                      <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">ctrl</kbd>
                      <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">K</kbd>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-base-content/60"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-lg border border-base-200 overflow-hidden">
                  <div className="p-2">
                    {searchQuery ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-base-content/60 px-2 py-1">
                          Search Results
                        </div>
                        <button className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg">
                          <Search className="w-4 h-4" />
                          <span>Results for "{searchQuery}"</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-base-content/60 px-2 py-1">
                          Recent Searches
                        </div>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg"
                            onClick={() => setSearchQuery(search)}
                          >
                            <Search className="w-4 h-4" />
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <NotificationsMenu />
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Improved Sidebar Component
const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const menuItems = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
      isActive: true
    },
    {
      label: 'Courses',
      icon: BookOpen,
      href: '/courses',
      count: '24',
      badge: 'New'
    },
    {
      label: 'Students',
      icon: Users,
      href: '/students',
      count: '892'
    },
    {
      label: 'Schedule',
      icon: Calendar,
      href: '/schedule',
      count: '12'
    },
    {
      label: 'Reports',
      icon: BarChart,
      href: '/reports',
      count: '4'
    },
    { type: 'divider' },
    {
      label: 'Documents',
      icon: FileText,
      href: '/documents'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ];

  return (
    <aside
      className={`fixed top-16 h-[calc(100vh-4rem)] bg-base-100 border-r border-base-200
        transition-all duration-300 z-30
        ${isOpen ? 'left-0' : '-left-64'}
        ${isMobile ? 'w-64' : 'w-64 lg:left-0 lg:z-20'}
        ${!isOpen && !isMobile ? 'lg:-left-64' : ''}`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              item.type === 'divider' ? (
                <li key={`divider-${index}`} className="h-px bg-base-200 my-3" />
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`group flex items-center gap-x-3 px-3 py-2 rounded-lg
                      hover:bg-base-200 transition-colors
                      ${item.isActive ? 'bg-primary text-primary-content hover:bg-primary/90' : ''}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.isActive ? 'text-current' : 'text-base-content/70'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <span className={`px-2 py-0.5 text-xs rounded-full
                        ${item.isActive ? 'bg-primary-content/20 text-primary-content' : 'bg-base-300 text-base-content'}`}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-content">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              )
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-base-200">
          <div className="flex items-center gap-3 px-2">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://picsum.photos/200" alt="User profile" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">John Doe</p>
              <p className="text-sm text-base-content/60 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Utility Components
const NotificationsMenu = () => {
  const notifications = [
    { id: 1, title: 'New course available', time: '5m ago', isUnread: true },
    { id: 2, title: 'Assignment due', time: '1h ago', isUnread: true },
    { id: 3, title: 'System update', time: '2h ago', isUnread: false },
  ];

  return (
    <div className="dropdown dropdown-end indicator">
      <button className="btn btn-ghost btn-circle">
        <Bell className="w-5 h-5" />
        {notifications.filter(n => n.isUnread).length > 0 && (
          <span className="indicator-item badge badge-primary badge-sm">
            {notifications.filter(n => n.isUnread).length}
          </span>
        )}
      </button>
      <div className="dropdown-content card card-compact w-80 shadow-lg bg-base-100">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Notifications</h3>
            <button className="btn btn-ghost btn-xs">Mark all as read</button>
          </div>
          <div className="divider my-1"></div>
          <ul className="space-y-2">
            {notifications.map(notification => (
              <li key={notification.id} className={`flex items-start gap-3 p-2 rounded-lg
                ${notification.isUnread ? 'bg-base-200' : ''}`}>
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-base-content/60">{notification.time}</p>
                </div>
                {notification.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = () => (
  <div className="dropdown dropdown-end">
    <button className="btn btn-ghost btn-circle">
      <Sun className="w-5 h-5 hidden dark:block" />
      <Moon className="w-5 h-5 block dark:hidden" />
    </button>
  </div>
);

const UserMenu = () => (
  <div className="dropdown dropdown-end">
    <button className="btn btn-ghost flex items-center gap-2">
      <div className="avatar">
        <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="https://picsum.photos/200" alt="Profile" />
        </div>
      </div>
      <span className="hidden sm:inline-block">John Doe</span>
      <ChevronDown className="hidden sm:inline-block w-4 h-4" />
    </button>
    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <li><a href="/messages"><MessageSquare className="w-4 h-4" /> Messages</a></li>
      <li><a href="/settings"><Settings className="w-4 h-4" /> Settings</a></li>
      <li><a href="/logout" className="text-error"><LogOut className="w-4 h-4" /> Logout</a></li>
    </ul>
  </div>
);


export default Layout;
