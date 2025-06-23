import { useContext, useState } from 'react';
import SideBar from '../components/SideBar';
import Parent from '../components/Parent';
import { ChatContext } from '../../context/ChatContext';

const Home = () => {
  const [isMedia, setIsMedia] = useState(false);
  const { selectedUser } = useContext(ChatContext);
  
  return (
    <div className="flex h-screen md:items-center md:justify-center md:min-h-[80vh] md:py-16">
      <div className="flex w-full h-full md:w-[85%] md:min-h-[80vh] bg-[#0d283b] md:shadow-3xl md:rounded-2xl overflow-hidden">
        
        <div className={`
          transition-all duration-300 ease-in-out 
          ${selectedUser ? 'w-[40%] hidden md:block' : 'w-full md:w-[50%]'}
          md:block
        `}>
          <SideBar setIsMedia={setIsMedia} />
        </div>

        <div className={`
          transition-all duration-300 ease-in-out 
          ${selectedUser ? 'w-full md:w-[60%]' : 'hidden md:block md:w-[50%]'}
        `}>
          <Parent 
            setIsMedia={setIsMedia}
            isMedia={isMedia}
          />
        </div>

      </div>
    </div>
  );
};

export default Home;