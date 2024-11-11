import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { activateItem } from '../../features/sidebar/sidebarSlice';
import { Home, BookOpen, Users, Calendar, BarChart, FileText, Settings } from 'lucide-react';
import PropTypes from 'prop-types';

const MenuItem = ({ item }) => {
  const dispatch = useDispatch();

  const icons = {
    Home,
    BookOpen,
    Users,
    Calendar,
    BarChart,
    FileText,
    Settings,
  };

  const IconComponent = icons[item.icon] || Home; // Default to Home if icon not found

  return (
    <li>
      <Link
        to={item.href}
        className={`group flex items-center gap-x-3 px-3 py-2 rounded-lg
                    hover:bg-base-200 transition-colors
                    ${item.isActive ? 'bg-primary text-primary-content hover:bg-primary/90' : ''}`}
        onClick={() => dispatch(activateItem(item.label))}
      >
        <IconComponent
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
      </Link>
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
    isActive: PropTypes.bool,
  }).isRequired,
};

export default MenuItem;
