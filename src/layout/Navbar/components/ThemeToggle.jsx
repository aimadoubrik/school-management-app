import { useEffect, useState } from 'react';
import { themeChange } from 'theme-change';
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'cupcake');

  useEffect(() => {
    themeChange(false);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'cupcake' ? 'dark' : 'cupcake';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div onClick={handleThemeToggle} >
      <button  className='btn btn-ghost'>
      <Around className='text-2xl mt-1' toggled={theme === 'cupcake'} onToggle={handleThemeToggle} duration={750} />
      </button>
    </div>
  );
};

export default ThemeToggle;

