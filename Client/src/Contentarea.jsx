
const ChatArea = () => {
  const messages = [
    { role: 'user', content: 'Hello, how are you?' },
    { role: 'assistant', content: 'I am doing well, thank you. How can I help you today?' },
  ];
  

  return (
    <div className="flex flex-col h-screen overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`bg-blue-500 text-white p-4 rounded-lg max-w-xs ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;