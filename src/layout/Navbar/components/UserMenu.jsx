import { ChevronDown, LogOut, MessageSquare, UserCircle2 } from 'lucide-react';
import { Avatar } from '../../../assets';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/slices/authSlice';

const UserMenu = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <button className="btn btn-ghost flex items-center gap-2">
        <div className="avatar">
          <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={Avatar} alt="Profile" />
          </div>
        </div>
        <span className="hidden sm:inline-block">{user.name === null ? 'User' : user.name} </span>
        <ChevronDown className="hidden sm:inline-block w-4 h-4" />
      </button>
      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <Link to="/school-management-app/messages">
            <MessageSquare className="w-4 h-4" /> Messages
          </Link>
        </li>
        <li>
          <Link to="/school-management-app/user-profile">
            <UserCircle2 className="w-4 h-4" /> Profile
          </Link>
        </li>
        <li>
          <button onClick={() => dispatch(logout())}>
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
