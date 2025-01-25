import QuickActions from './components/QuickActions';
import GreetingHeader from './components/GreetingHeader';
import ChatlingBot from './components/ChatlingBot';
import { getUserFromStorage } from '../../utils/';

function HomePage() {
  const user = getUserFromStorage('user');

  return (
    <div className="flex justify-center flex-wrap gap-4">
      <GreetingHeader />
      <QuickActions />
      {(user.role === 'super user' || user.role === 'trainer' || user.role === 'admin') && <ChatlingBot chatbotId="9718397947" />}
    </div>
  );
}

export default HomePage;

