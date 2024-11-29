import QuickActions from './components/QuickActions';
import GreetingHeader from './components/GreetingHeader';
function HomePage() {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <GreetingHeader />
      <QuickActions />
      <ChatbotIframe2 chatbotId="9718397947" />
    </div>
    
  );
}

export default HomePage;