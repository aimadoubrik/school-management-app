import React, { useEffect } from 'react';

const ChatbotIframe = () => {
  useEffect(() => {
    window.embeddedChatbotConfig = {
      chatbotId: "2RWLFtBve7klLfmH0LaS3",
      domain: "www.chatbase.co",
    };

    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute('chatbotId', "2RWLFtBve7klLfmH0LaS3");
    script.setAttribute('domain', "www.chatbase.co");
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      
    </div>
  );
};

export default ChatbotIframe;