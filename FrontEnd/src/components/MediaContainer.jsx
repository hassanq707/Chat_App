// import React, { useContext, useEffect, useState } from 'react';
// import { ChatContext } from '../../context/ChatContext';
// import { AuthContext } from '../../context/AuthContext';

// const MediaContainer = ({ setIsMedia }) => {
//   const { messages, selectedUser, setSelectedUser } = useContext(ChatContext);
//   const { logout } = useContext(AuthContext);
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     setImages(messages
//       ? messages.filter((msg) => msg.image).map(img => img.image) 
//       : []);
//   }, [messages]);

//   return (
//     <div className="w-full h-full flex flex-col bg-[#0b2131] text-white">
//       <div className="flex items-center gap-4 px-4 py-3.5 border-b border-white/10 bg-[#0d283b]">
//         <i
//           className="ri-arrow-left-line text-2xl text-white/70 hover:text-white cursor-pointer"
//           onClick={() => setIsMedia(false)}
//         ></i>
//         <span className="text-lg font-medium">Media</span>
//       </div>

//       <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10 w-full">
//         <img
//           src={selectedUser?.profilePic || '/images/default.png'}
//           alt="User"
//           className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
//         />

//         <div className="flex flex-col justify-center flex-1">
//           <p className="text-md md:text-lg font-semibold max-w-[60%] text-white leading-tight truncate">
//             {selectedUser?.fullname}
//           </p>
//           <p className="text-white/80 text-sm mt-.5 max-w-[90%] truncate">
//             {selectedUser?.bio}
//           </p>
//         </div>
//       </div>

//       <div className="flex flex-col h-[calc(100vh-193px)] gap-2 px-4 py-3 overflow-y-auto flex-1 custom-scrollbar">
//         <h2 className="text-lg font-semibold mb-2">Shared Media</h2>
//         {images.length > 0 ? (
//           <div className="grid grid-cols-4 gap-3">
//             {images.map((url, idx) => (
//               <div key={idx} className="w-full aspect-square overflow-hidden rounded-lg">
//                 <img
//                   onClick={() => window.open(url, '_blank')}
//                   src={url}
//                   alt={`media-${idx}`}
//                   className="w-full h-full object-cover cursor-pointer"
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
//             <div className="relative mb-4">
//               <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
//                 <i className="ri-image-line text-2xl text-white/40"></i>
//               </div>
//               <div className="absolute -inset-2 border border-white/10 rounded-lg pointer-events-none"></div>
//             </div>
//             <h3 className="text-white font-medium mb-1">No shared media</h3>
//             <p className="text-white/60 text-sm max-w-xs">
//               Send photos or files to create shared memories
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="px-4 py-3 border-t border-white/10">
//         <button
//           className="w-full py-2 bg-[#1f4b71] hover:bg-[#183a57] transition rounded-full text-white font-semibold"
//           onClick={() => {
//             logout();
//             setSelectedUser(null);
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MediaContainer;


import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const MediaContainer = ({ setIsMedia }) => {
  const { messages, selectedUser, setSelectedUser } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(messages
      ? messages.filter((msg) => msg.image).map(img => img.image) 
      : []);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#0b2131] text-white">
      <div className="sticky top-0 z-10 flex-shrink-0 flex items-center gap-4 px-4 py-3.5 border-b border-white/10 bg-[#0d283b]">
        <i
          className="ri-arrow-left-line text-2xl text-white/70 hover:text-white cursor-pointer"
          onClick={() => setIsMedia(false)}
        ></i>
        <span className="text-lg font-medium">Media</span>
      </div>

      <div className="flex-shrink-0 flex items-center gap-4 px-4 py-4 border-b border-white/10 w-full">
        <img
          src={selectedUser?.profilePic || '/images/default.png'}
          alt="User"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
        />

        <div className="flex flex-col justify-center flex-1">
          <p className="text-md md:text-lg font-semibold max-w-[60%] text-white leading-tight truncate">
            {selectedUser?.fullname}
          </p>
          <p className="text-white/80 text-sm mt-.5 max-w-[90%] truncate">
            {selectedUser?.bio}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
        <h2 className="text-lg font-semibold mb-2 sticky top-0 bg-[#0b2131] pt-2 pb-3 z-10">
          Shared Media
        </h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 pb-3">
            {images.map((url, idx) => (
              <div key={idx} className="w-full aspect-square overflow-hidden rounded-lg">
                <img
                  onClick={() => window.open(url, '_blank')}
                  src={url}
                  alt={`media-${idx}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                <i className="ri-image-line text-2xl text-white/40"></i>
              </div>
              <div className="absolute -inset-2 border border-white/10 rounded-lg pointer-events-none"></div>
            </div>
            <h3 className="text-white font-medium mb-1">No shared media</h3>
            <p className="text-white/60 text-sm max-w-xs">
              Send photos or files to create shared memories
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 flex-shrink-0 px-4 py-3 border-t border-white/10 bg-[#0b2131]">
        <button
          className="w-full py-2 bg-[#1f4b71] hover:bg-[#183a57] transition rounded-full text-white font-semibold"
          onClick={() => {
            logout();
            setSelectedUser(null);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MediaContainer;