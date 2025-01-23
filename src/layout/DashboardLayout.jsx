import { useContext } from 'react';
import { LayoutProvider, LayoutContext } from './context/LayoutContext';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router';

const DashboardContent = () => {
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useContext(LayoutContext);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      <div className="w-full flex fixed top-20 px-2 lg:gap-x-2 h-[calc(100vh-5.5rem)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          className={`
            flex-1
            overflow-y-auto
            p-8
            bg-base-100
            shadow-md
            rounded-2xl
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Main Outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <LayoutProvider>
      <DashboardContent />
    </LayoutProvider>
  );
};

export default DashboardLayout;
