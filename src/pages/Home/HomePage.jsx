import QuickActions from './components/QuickActions';
import ChatbotIframe from './components/ChatbotIframe';
function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <QuickActions />
      <ChatbotIframe />
    </div>
    
  );
}

export default HomePage;
