import { SearchBar, SidebarToggle, UserMenu, NotificationsMenu, ThemeToggle } from './components';
import { Logo } from '../../assets/';
import { Link } from 'react-router-dom';
import { Stars, FileText } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-2">
      <nav className="navbar mx-auto rounded-2xl bg-base-100">
        {/* Left Section */}
        <div className="navbar-start gap-2">
          <SidebarToggle />
          <Link to="/" className="btn btn-ghost flex items-center gap-1 px-2">
            <Logo className="w-10 h-10" />
            <span className="font-semibold text-xl tracking-tight hidden sm:inline-block">
              OFPPT
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-center px-2 max-w-2xl">
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="navbar-end gap-1 md:gap-2">
          <Link
            to="/docs"
            title='Document Generator'
            className="group relative inline-flex items-center justify-center 
                 p-2 rounded-full transition-all duration-300 
                 hover:bg-blue-50 hover:shadow-sm"
          >
            {/* Main Icon */}
            <FileText
              className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 
                   transition-colors duration-300"
            />

            {/* Animated Stars Indicator */}
            <div className="absolute top-1 right-2 transform translate-x-1/4 -translate-y-1/4">
              <Stars
                className="w-6 h-6 text-yellow-400 
                     animate-ping opacity-75 
                     group-hover:animate-pulse"
              />
              <Stars
                className="w-6 h-6 text-yellow-500 absolute
                     opacity-75 bg-base-100 
                     top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     group-hover:scale-110 transition-transform"
              />
            </div>
          </Link>
          <NotificationsMenu />
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
