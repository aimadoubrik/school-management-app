import React from 'react';
import { 
  BookOpen, Users, Calendar, Settings, BarChart,
  GraduationCap, FileText, Bell, LayoutDashboard 
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { 
      label: 'Overview',
      icon: LayoutDashboard,
      color: 'text-primary',
      isActive: true 
    },
    { 
      label: 'Courses', 
      icon: BookOpen, 
      count: '24',
      color: 'text-secondary',
      badge: 'New' 
    },
    { 
      label: 'Students', 
      icon: Users, 
      count: '892',
      color: 'text-accent' 
    },
    { 
      label: 'Schedule', 
      icon: Calendar, 
      count: '12',
      color: 'text-info' 
    },
    { 
      label: 'Reports', 
      icon: BarChart, 
      count: '4',
      color: 'text-warning' 
    },
    { type: 'divider' },
    { 
      label: 'Notifications', 
      icon: Bell,
      count: '3',
      color: 'text-error' 
    },
    { 
      label: 'Documents', 
      icon: FileText,
      color: 'text-success' 
    },
    { type: 'divider' },
    { 
      label: 'Settings', 
      icon: Settings,
      color: 'text-neutral' 
    }
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 
        ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full'} 
        bg-base-200 z-20`}
    >
      <div className="h-full flex flex-col p-4">
        {/* Brand Section */}
        <div className="flex items-center gap-2 px-4 py-3 mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">EduDash Pro</h2>
            <p className="text-xs text-base-content/60">School Management</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              item.type === 'divider' ? (
                <li key={`divider-${index}`} className="h-px bg-base-300 my-2" />
              ) : (
                <li key={item.label}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                      hover:bg-base-300 group relative
                      ${item.isActive ? 'bg-primary text-primary-content' : ''}`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <span className="px-2 py-1 text-xs rounded-full bg-base-300 text-base-content">
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-content">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              )
            ))}
          </ul>
        </nav>

        {/* Theme Settings */}
        <div className="border-t border-base-300 pt-4">
          <details className="collapse collapse-arrow bg-base-200">
            <summary className="collapse-title font-medium">Theme Settings</summary>
            <div className="collapse-content">
              <label className="label cursor-pointer">
                <span className="label-text">Dark mode</span>
                <input type="checkbox" className="toggle toggle-primary" />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Compact menu</span>
                <input type="checkbox" className="toggle toggle-primary" />
              </label>
            </div>
          </details>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-4 mt-4 bg-base-300 rounded-lg">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="/api/placeholder/30/30" alt="User profile" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">John Doe</p>
              <p className="text-sm text-base-content/60 truncate">Administrator</p>
            </div>
            <div className="dropdown dropdown-end">
              <button 
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="User menu"
              >
                <Settings className="w-4 h-4" />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;