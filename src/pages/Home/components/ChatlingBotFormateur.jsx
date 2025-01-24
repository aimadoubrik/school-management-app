import { useEffect } from "react";

const ChatlingBotFormateur = () => {
  useEffect(() => {
    // Set the chatbot configuration
    window.chtlConfig = { chatbotId: "8861416361" };

    // Create the script element
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.id = "chatling-embed-script";
    script.src = "https://chatling.ai/js/embed.js";
    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
      delete window.chtlConfig;
    };
  }, []);

  return null;
};

export default ChatlingBotFormateur;
