import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const SideBar = ({ setIsMedia }) => {
  const [input, setInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, authUser, onlineUsers } = useContext(AuthContext);
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user) => (
    user.fullname.toLowerCase().includes(input.toLowerCase())
  )) : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className="flex flex-col h-full w-full text-white bg-[#0d283b]">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
        <div className="flex items-center space-x-1">
          <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl sm:text-md md:text-lg lg:text-xl font-semibold tracking-wide mb-.5">
            BaatCheet
          </span>
        </div>

        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img
              src={authUser?.profilePic || "/images/default.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium text-white pt-1">{authUser?.fullname?.split(" ")[0]}</span>
            <i className="ri-arrow-down-s-line text-xl text-white pt-2"></i>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-[#18445f] border border-white/10 rounded-xl shadow-xl z-20">
              <ul>
                <li
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-white/10 flex items-center gap-2 text-sm text-white transition-all duration-150 cursor-pointer rounded-t-xl"
                >
                  <i className="ri-user-settings-line text-lg text-blue-400"></i>
                  <span>Edit Profile</span>
                </li>
                <li
                  className="px-4 py-3 hover:bg-white/10 flex items-center gap-2 text-sm text-white transition-all duration-150 cursor-pointer rounded-b-xl"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  <i className="ri-logout-box-r-line text-lg text-rose-500"></i>
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 relative">
        <i className="ri-search-line absolute left-7 top-1/2 mt-[2px] transform -translate-y-1/2 text-white/60 text-xl"></i>
        <input
          type="text"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search User..."
          className="w-full pl-11 pr-3 py-2 rounded-lg bg-[#18445f] text-white placeholder-white/60 outline-none text-[16px] overflow-hidden"
        />
      </div>

      <div className="overflow-y-auto px-2 space-y-3 pb-4 h-[calc(100vh-112px)] custom-scrollbar">
        {filteredUsers.map((user, index) => (
          <div
            key={user._id}
            className={`flex items-center justify-between hover:bg-[#13344c] p-2 rounded cursor-pointer transition 
            ${selectedUser?._id === user._id ? "bg-[#13344c]" : ""}
            `}
            onClick={() => {
              if (selectedUser?._id === user._id) {
                setSelectedUser(null);
              } else {
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0
                }));
                setSelectedUser(user);
                setIsMedia(false);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic || "/images/default.png"}
                alt={user.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-md">{user.fullname}</p>
                {
                  onlineUsers.includes(user._id)
                    ? <p className="text-sm font-semibold text-[#20bd30]">Online</p>
                    : <p className="text-sm text-white/50">Offline</p>
                }
              </div>
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className="bg-[#2e5e87] text-sm px-2 py-1 rounded-full text-white font-semibold min-w-7 text-center">
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;