import { useContext, useState } from 'react';
import SideBar from '../components/SideBar';
import Parent from '../components/Parent';
import { ChatContext } from '../../context/ChatContext';

const Home = () => {
  const [isMedia, setIsMedia] = useState(false);
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="flex h-screen md:items-center md:justify-center md:min-h-[80vh] md:py-16">
      <div className="relative flex w-full h-full md:w-[85%] md:min-h-[80vh] bg-[#0d283b] md:shadow-3xl md:rounded-2xl overflow-hidden">

        <div
          className={`absolute inset-0 transition-transform duration-500 ease-in-out md:static md:translate-x-0 
        ${selectedUser ? '-translate-x-full' : 'translate-x-0'} 
        w-full md:w-[40%]`}
        >
          <SideBar setIsMedia={setIsMedia} />
        </div>

        <div
          className={`absolute inset-0 transition-transform duration-500 ease-in-out md:static md:translate-x-0 
        ${selectedUser ? 'translate-x-0' : 'translate-x-full'} 
        w-full md:w-[60%]`}
        >
          <Parent setIsMedia={setIsMedia} isMedia={isMedia} />
        </div>

      </div>
    </div>

  );
};

export default Home;