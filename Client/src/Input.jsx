
const MessageInput = () => {
  return (
    <div className="bg-gray-800 p-4">
      <div className="flex">
        <input type="text" className="bg-gray-700 text-white p-2 flex-1" placeholder="Type your message..." />
        <button className="bg-blue-500 text-white p-2 rounded-lg">Send</button>
      </div>
    </div>
  );
};

export default MessageInput;