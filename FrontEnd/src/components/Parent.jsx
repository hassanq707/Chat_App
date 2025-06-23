import React, { useContext } from 'react';
import MediaContainer from './MediaContainer';
import ChatContainer from './ChatContainer';
import { ChatContext } from '../../context/ChatContext';

const Parent = ({ setIsMedia, isMedia }) => {
  const { selectedUser } = useContext(ChatContext);
  
  return selectedUser ? (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`absolute w-full h-full transition-transform duration-500 ease-in-out 
        ${isMedia ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <ChatContainer setIsMedia={setIsMedia} />
      </div>

      <div
        className={`absolute w-full h-full transition-transform duration-500 ease-in-out 
        ${isMedia ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <MediaContainer setIsMedia={setIsMedia} />
      </div>
    </div>
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-white text-center space-y-4 p-6">
      <img src="/images/logo.png" alt="BaatCheet Logo" className="w-24 h-24" />
      <h1 className="text-3xl font-bold">BaatCheet</h1>
      <p className="text-white/60 text-lg">Select a chat to start messaging</p>
    </div>
  );
};

export default Parent;