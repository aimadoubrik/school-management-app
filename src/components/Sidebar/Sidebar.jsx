import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  BarChart,
  FileText,
  Settings,
} from 'lucide-react';

import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, isMobile }) => {
  const menuItems = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      href: '/dashboard',
      isActive: true,
    },
    {
      label: 'Courses',
      icon: BookOpen,
      href: '/courses',
      count: '24',
      badge: 'New',
    },
    {
      label: 'Students',
      icon: Users,
      href: '/students',
      count: '892',
    },
    {
      label: 'Schedule',
      icon: Calendar,
      href: '/schedule',
      count: '12',
    },
    {
      label: 'Reports',
      icon: BarChart,
      href: '/reports',
      count: '4',
    },
    { type: 'divider' },
    {
      label: 'Documents',
      icon: FileText,
      href: '/documents',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  return (
    <aside
      className={`fixed rounded-lg top-20 h-[calc(100vh-5.5rem)] bg-base-100 border-r border-base-200
          transition-all duration-300 z-30
          ${isOpen ? 'left-2' : '-left-64'}
          ${isMobile ? 'w-64' : 'w-64 lg:left-2 lg:z-20'}
          ${!isOpen && !isMobile ? 'lg:-left-64' : ''}`}
    >
      <div className="h-full flex flex-col overflow-y-auto ">
        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) =>
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
                    <item.icon
                      className={`w-5 h-5 ${item.isActive ? 'text-current' : 'text-base-content/70'}`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full
                          ${item.isActive ? 'bg-primary-content/20 text-primary-content' : 'bg-base-300 text-base-content'}`}
                      >
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
            )}
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

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;
