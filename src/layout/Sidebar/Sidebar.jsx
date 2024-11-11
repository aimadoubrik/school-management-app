import { useSelector } from 'react-redux';
import profilePicture from '../../assets/avatar.png';
import MenuItem from './MenuItem';

const Sidebar = () => {
  const { isOpen } = useSelector((state) => state.sidebar);
  const { isMobile } = useSelector((state) => state.ui);

  const menuItems = useSelector((state) => state.sidebar.items);

  return (
    <aside
      className={`fixed rounded-lg top-20 h-[calc(100vh-5.5rem)] bg-base-100 border-r border-base-200
          transition-all duration-300 z-30
          ${isOpen ? 'left-2' : '-left-64'}
          ${isMobile ? 'w-64' : 'w-64 lg:left-2 lg:z-20'}
          ${!isOpen && !isMobile ? 'lg:-left-64' : ''}`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) =>
              item.type === 'divider' ? (
                <li key={`divider-${index}`} className="h-px bg-base-200 my-3" />
              ) : (
                <MenuItem key={item.label} item={item} />
              )
            )}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-base-200">
          <div className="flex items-center gap-3 px-2">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={profilePicture} alt="User profile" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Jane Doe</p>
              <p className="text-sm text-base-content/60 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
