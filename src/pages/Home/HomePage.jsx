import QuickActions from './components/QuickActions';
import GreetingHeader from './components/GreetingHeader';
import ChatlingBotFormateur from './components/ChatlingBotFormateur';
function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <GreetingHeader />
      <QuickActions />
      <ChatlingBotFormateur chatbotId={"9718397947"} />
    </div>
  );
}

export default HomePage;
