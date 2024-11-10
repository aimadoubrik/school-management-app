import { Moon, Sun } from 'lucide-react';

const ThemeSelector = () => (
  <div className="dropdown dropdown-end">
    <button className="btn btn-ghost btn-circle">
      <Sun className="w-5 h-5 hidden dark:block" />
      <Moon className="w-5 h-5 block dark:hidden" />
    </button>
  </div>
);

export default ThemeSelector;
