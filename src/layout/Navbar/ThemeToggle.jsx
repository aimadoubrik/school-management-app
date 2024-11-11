import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../features/theme/themeSlice';
import { Moon, Sun } from 'lucide-react';

const ThemeSelector = () => {
  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle" onClick={handleToggleTheme}>
        <Sun className="w-5 h-5 hidden dark:block" />
        <Moon className="w-5 h-5 block dark:hidden" />
      </button>
    </div>
  );
};

export default ThemeSelector;
