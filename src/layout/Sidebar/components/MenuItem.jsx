import { NavLink } from 'react-router';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { useContext } from 'react';
import { LayoutContext } from '../../context/LayoutContext';

const MenuItem = ({ item }) => {
  const IconComponent = Icons[item.icon];

  const { isSidebarOpen } = useContext(LayoutContext);

  return (
    <li>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center gap-x-3 px-3 py-2 rounded-lg
           hover:bg-base-200 transition-colors duration-300 ease-in-out
           ${isActive ? 'bg-primary text-primary-content hover:bg-primary/90' : 'text-base-content'}`
        }
      >
        {({ isActive }) => (
          <>
            {IconComponent && (
              <IconComponent
                className={`w-5 h-5 ${isActive ? 'text-current' : 'text-base-content/70'}`}
              />
            )}
            <span
              className={`transition-transform duration-300 ease-in-out overflow-hidden
                          ${isSidebarOpen ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-95 w-0 hidden'}
                        `}
            >
              {item.label}
            </span>

            {/* {item.count !== undefined && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full
                  ${
                    isActive
                      ? 'bg-primary-content/20 text-primary-content'
                      : 'bg-base-300 text-base-content'
                  }`}
              >
                {item.count}
              </span>
            )}
            {item.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-content">
                {item.badge}
              </span>
            )} */}
          </>
        )}
      </NavLink>
    </li>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
    count: PropTypes.number,
    badge: PropTypes.string,
  }).isRequired,
};

export default MenuItem;
