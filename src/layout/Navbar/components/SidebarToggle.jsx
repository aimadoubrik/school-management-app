import { useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext'; // Ensure the correct path to LayoutContext

const SidebarToggle = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('SidebarToggle must be used within a LayoutProvider');
  }

  const { isSidebarOpen, setIsSidebarOpen } = context;

  return (
    <button
      type="button"
      data-sidebar-toggle
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="btn btn-ghost lg:hidden"
      aria-label={`${isSidebarOpen ? 'Close' : 'Open'} sidebar`}
      aria-expanded={isSidebarOpen}
      aria-controls="sidebar"
    >
      {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
};

export default SidebarToggle;
