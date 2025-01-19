import { memo, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { LayoutContext } from '../context/LayoutContext';
import { MenuItem, Divider, UserProfile } from './components';
import menuItems from './config/menuItems';
import { getUserFromStorage } from '../../utils';

// Role permissions configuration
const ROLE_PERMISSIONS = {
  'super user': [
    'Home',
    'Courses',
    'Quizzes',
    'Attendance',
    'Schedule',
    'Generate Documents',
    'Documents',
    'Demandes',
    'Scheduler',
    'Specializations',
    'Competences',
    'Secteurs',
    'Groups',
    'Modules',
    'Settings',
    'Trainees',
    'Formateurs',
  ],
  admin: [
    'Home',
    'Attendance',
    'Documents',
    'Demandes',
    'Scheduler',
    'Specializations',
    'Competences',
    'Secteurs',
    'Groups',
    'Modules',
    'Trainees',
    'Formateurs',
  ],
  trainer: ['Home', 'Courses', 'Quizzes', 'Trainees', 'Attendance', 'Schedule', 'Documents'],
  trainee: ['Home', 'Courses', 'Quizzes', 'Schedule', 'Documents'],
};

const getFilteredMenuItems = (role, items) => {
  const allowedLabels = ROLE_PERMISSIONS[role] || [];

  return items.reduce((acc, item, index) => {
    if (item.type === 'divider') {
      const prevItem = acc[acc.length - 1];
      if (prevItem && !prevItem.type) {
        acc.push(item);
      }
      return acc;
    }

    if (item.label && allowedLabels.includes(item.label)) {
      acc.push(item);
    }

    return acc;
  }, []);
};

const useSidebarCloseHandlers = (sidebarRef, isSidebarOpen, setIsSidebarOpen, isMobile) => {
  const location = useLocation();

  const handleClickOutside = useCallback(
    (event) => {
      if (!isMobile) return;

      const target = event.target;
      const isOutside =
        !sidebarRef.current?.contains(target) && !target.closest('[data-sidebar-toggle]');

      if (isOutside) {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen, isMobile, sidebarRef]
  );

  const handleEscKey = useCallback(
    (event) => {
      if (event.key === 'Escape' && isMobile) {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen, isMobile]
  );

  useEffect(() => {
    if (!isSidebarOpen) return;

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscKey, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscKey, true);
    };
  }, [isSidebarOpen, handleClickOutside, handleEscKey]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setIsSidebarOpen]);
};

const SidebarOverlay = memo(({ isVisible, onClose }) => (
  <div
    className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-20 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    onClick={onClose}
    onKeyDown={(e) => e.key === 'Enter' && onClose()}
    role="button"
    tabIndex={isVisible ? 0 : -1}
    aria-hidden={!isVisible}
  />
));

SidebarOverlay.displayName = 'SidebarOverlay';

const SidebarContent = memo(({ menuItems, userData, isSidebarOpen }) => (
  <>
    <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
      <ul className="space-y-1" role="menu">
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={`divider-${index}`} />;
          }
          return <MenuItem key={item.href || `item-${index}`} item={item} />;
        })}
      </ul>
    </nav>

    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-24 opacity-100' : 'max-h-0 w-0 opacity-0'}`}
    >
      <div className="p-4 border-t border-base-200">
        <UserProfile
          name={userData?.name ?? 'Guest'}
          role={userData?.role ?? 'User'}
          profile_picture={userData?.profile_picture}
        />
      </div>
    </div>
  </>
));

SidebarContent.displayName = 'SidebarContent';

const Sidebar = memo(() => {
  const sidebarRef = useRef(null);
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = useContext(LayoutContext);
  const userData = getUserFromStorage('user');

  const filteredMenuItems = useMemo(
    () => getFilteredMenuItems(userData?.role ?? 'user', menuItems),
    [userData?.role]
  );

  useSidebarCloseHandlers(sidebarRef, isSidebarOpen, setIsSidebarOpen, isMobile);

  // Separate classes for mobile and desktop
  const baseClasses = `
    rounded-2xl
    bg-base-100
    transition-all
    duration-300
    ease-in-out
    z-30
  `.trim();

  const mobileClasses = `
    shadow-lg
    ${isSidebarOpen ? 'w-64' : '-translate-x-[16.5rem] w-0'}
  `.trim();

  const desktopClasses = `
    ${isSidebarOpen ? 'w-64' : 'w-auto'}
  `.trim();

  const sidebarClasses = `
    ${baseClasses}
    ${isMobile ? mobileClasses : desktopClasses}
  `.trim();

  return (
    <>
      <SidebarOverlay
        isVisible={isSidebarOpen && isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={sidebarClasses}
        aria-hidden={isMobile && !isSidebarOpen}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="h-full flex flex-col">
          <SidebarContent
            menuItems={filteredMenuItems}
            userData={userData}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
