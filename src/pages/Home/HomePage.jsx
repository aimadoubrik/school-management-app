import QuickActions from './components/QuickActions';
import ChatbotIframe from './components/ChatbotIframe';
import ChatbotIframe2 from './components/ChatbotIframe2';
function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <QuickActions />
      <ChatbotIframe2 chatbotId="9718397947" />
    </div>
    
  );
}

export default HomePage;
