import { Bell } from 'lucide-react';

const NotificationBell = () => {
    return (
        <button className="btn btn-ghost btn-circle">
            <div className="indicator">
                <Bell className="h-5 w-5" />
                <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
        </button>
    );
};

export default NotificationBell