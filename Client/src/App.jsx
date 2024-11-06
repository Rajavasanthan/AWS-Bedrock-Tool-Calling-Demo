import { useState } from "react";
import {
  MessageCircle,
  Menu,
  Phone,
  Video,
  Users,
  Settings,
} from "lucide-react";
import axios from "axios";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("What is the Weather in New Delhi?");
  const [convId, setConvId] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: timeString,
      },
    ]);

    setNewMessage("");

    let payload = {
      question: newMessage,
    };

    if (convId) {
      payload.conversationId = convId;
    }

    const aiResp = await axios.post("http://localhost:3000/ai", payload);

    setConvId(aiResp.data.conversationId);

    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: aiResp.data.message,
        sender: "other",
        timestamp: timeString,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-800">ChatApp</span>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-500">
                <Phone className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                <Video className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                <Users className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-500">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-4 ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-xs mt-1 block ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
