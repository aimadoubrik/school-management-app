import QuickActions from './components/QuickActions';
import GreetingHeader from './components/GreetingHeader';
import ChatlingBotAdmin from './components/ChatlingBotAdmin';
import ChatlingBotFormateur from './components/ChatlingBotFormateur';
function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <GreetingHeader />
      <QuickActions />
      <ChatlingBotAdmin />
    </div>
  );
}

export default HomePage;
