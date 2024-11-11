import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from '../features/sidebar/sidebarSlice';
import { toggleMobile } from '../features/ui/uiSlice';
import PropTypes from 'prop-types';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';

// Layout wrapper component
const Layout = ({ children }) => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const { isMobile } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      dispatch(toggleMobile(mobile));
      if (mobile) dispatch(closeSidebar());
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Sidebar />
      <main
        className={`fixed top-20 right-2 p-2 bg-base-100 rounded-lg transition-all duration-300
        ${isMobile ? 'w-[calc(100vw-1rem)]' : 'w-[calc(100vw-17.5rem)]'}`}
      >
        <div className="p-6">{children}</div>
      </main>
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => dispatch(closeSidebar)} />
      )}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
