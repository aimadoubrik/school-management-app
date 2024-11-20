// src/layout/Sidebar/Sidebar.jsx

import { memo, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from '../context/LayoutContext';
import { MenuItem, Divider, UserProfile } from './components';
import avatar from '/src/assets/avatar.png';
import menuItems from './config/menuItems';

// Custom hook for handling user data with better error handling and types
const useUserData = () => {
  const storedUser = (() => {
    try {
      const localUser = localStorage.getItem('user');
      const sessionUser = sessionStorage.getItem('user');
      return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  })();

  return {
    name: storedUser?.name ?? '',
    role: storedUser?.role ?? '',
    photo: storedUser?.photo ?? avatar,
  };
};

// Custom hook for handling sidebar close events with cleanup
const useSidebarCloseHandlers = (sidebarRef, context) => {
  const location = useLocation();
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = context;

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return;

    const handleClickOutside = (event) => {
      const isToggleButton = event.target.closest('[data-sidebar-toggle]');
      const isInsideSidebar = sidebarRef.current?.contains(event.target);

      if (!isToggleButton && !isInsideSidebar) {
        setIsSidebarOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEscKey, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isSidebarOpen, isMobile, setIsSidebarOpen]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setIsSidebarOpen]);
};

const Sidebar = memo(() => {
  const sidebarRef = useRef(null);
  const layoutContext = useContext(LayoutContext);
  const userData = useUserData();
  const location = useLocation();

  if (!layoutContext) {
    throw new Error('Sidebar must be used within a LayoutProvider');
  }

  const { isSidebarOpen, isMobile, setIsSidebarOpen } = layoutContext;

  // Initialize hooks
  useSidebarCloseHandlers(sidebarRef, layoutContext);

  const sidebarClasses = {
    aside: `
      fixed rounded-lg top-20 
      h-[calc(100vh-5.5rem)] 
      bg-base-100 border-r border-base-200
      transition-transform duration-300 ease-in-out
      w-64
      ${isMobile ? 'z-30' : 'z-20 lg:translate-x-2'}
      ${!isSidebarOpen && (isMobile || !isMobile) ? '-translate-x-full' : 'translate-x-2'}
    `.trim(),
    overlay: `
      fixed inset-0 bg-black/20 backdrop-blur-sm z-20
      transition-opacity duration-300
      ${isSidebarOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `.trim(),
    nav: 'flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300',
    menuList: 'space-y-1',
    userSection: 'p-4 border-t border-base-200',
  };

  return (
    <>
      <div
        className={sidebarClasses.overlay}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        className={sidebarClasses.aside}
        aria-hidden={!isSidebarOpen}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="h-full flex flex-col">
          <nav className={sidebarClasses.nav}>
            <ul className={sidebarClasses.menuList} role="menu">
              {menuItems.map((item, index) =>
                item.type === 'divider' ? (
                  <Divider key={`divider-${index}`} />
                ) : (
                  <MenuItem
                    key={item.href || `menu-item-${index}`}
                    item={item}
                    isActive={location.pathname === item.href}
                  />
                )
              )}
            </ul>
          </nav>

          <div className={sidebarClasses.userSection}>
            <UserProfile name={userData.name} role={userData.role} profilePhoto={userData.photo} />
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
