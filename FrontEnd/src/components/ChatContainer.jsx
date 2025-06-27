// import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
// import { ChatContext } from '../../context/ChatContext';
// import { AuthContext } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const EmojiPicker = lazy(() => import('emoji-picker-react'));

// const ChatContainer = ({ setIsMedia }) => {
//     const { messages, clearMessages, setSelectedUser, selectedUser, getSelectedUserMessages, sendMsgToSelectedUser, markMessageAsSeen } = useContext(ChatContext);
//     const { authUser, onlineUsers } = useContext(AuthContext);

//     const [message, setMessage] = useState('');
//     const [showEmoji, setShowEmoji] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [imageUploading, setImageUploading] = useState(false);

//     const bottomRef = useRef();
//     const emojiRef = useRef();
//     const inputRef = useRef();
//     const messagesRef = useRef();

//     useEffect(() => {
//         const fetchData = async () => {
//             if (selectedUser) {
//                 setLoading(true);
//                 await getSelectedUserMessages(selectedUser._id);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [selectedUser]);

//     useEffect(() => {
//         if (!loading && selectedUser && messages.length) {
//             setTimeout(() => {
//                 bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//             }, 100);
//         }
//     }, [loading, selectedUser, messages]);

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (showEmoji && !emojiRef.current?.contains(e.target)) {
//                 setShowEmoji(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [showEmoji]);

//     useEffect(() => {
//         if (!selectedUser || !messages.length) return;

//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         const messageId = entry.target.dataset.messageId;
//                         const senderId = entry.target.dataset.senderId;

//                         if (senderId === selectedUser._id && entry.target.dataset.seen === 'false') {
//                             markMessageAsSeen(messageId);
//                             entry.target.dataset.seen = 'true';
//                             observer.unobserve(entry.target);
//                         }
//                     }
//                 });
//             },
//             {
//                 threshold: 0.5,
//                 rootMargin: '0px 0px -50px 0px',
//             }
//         );

//         const unseenElements = Array.from(
//             document.querySelectorAll(`[data-sender-id="${selectedUser._id}"][data-seen="false"]`)
//         );

//         unseenElements.forEach(el => observer.observe(el));

//         return () => {
//             observer.disconnect();
//         };
//     }, [messages, selectedUser]);

//     const sendMessage = () => {
//         if (!message.trim()) return;

//         const msgToSend = message;
//         setMessage('');
//         setShowEmoji(false);
//         inputRef.current?.focus();
//         sendMsgToSelectedUser({ text: msgToSend });
//     };


//     const handleSendImage = (e) => {
//         const file = e.target.files[0];
//         if (!file || !file.type.startsWith("image/")) {
//             return toast.error("Select an image file");
//         }
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewImage(reader.result);
//             e.target.value = "";
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleSendPreviewImage = async () => {
//         if (previewImage) {
//             setImageUploading(true);
//             await sendMsgToSelectedUser({ image: previewImage });
//             setImageUploading(false);
//             setPreviewImage(null);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     return (
//         <div className="flex flex-col h-full bg-[#0b2131]">

//             <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0d283b]">
//                 <div className="flex items-center gap-3 relative">

//                     <i
//                         className="ri-arrow-left-line text-2xl text-white/70 hover:text-white cursor-pointer md:hidden"
//                         onClick={() => {
//                             setSelectedUser(null)
//                             clearMessages();
//                         }}
//                     ></i>

//                     <div className="relative">
//                         <img
//                             src={selectedUser.profilePic || '/images/default.png'}
//                             alt={selectedUser.fullname}
//                             className="w-9 h-9 rounded-full object-cover"
//                         />
//                         {onlineUsers.includes(selectedUser._id) && (
//                             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0d283b] rounded-full"></span>
//                         )}
//                     </div>
//                     <span className="text-md font-medium text-white">{selectedUser.fullname}</span>
//                 </div>

//                 <div onClick={() => setIsMedia(true)} className="flex items-center gap-3">
//                     <i className="ri-information-line text-3xl text-white/70 hover:text-white cursor-pointer"></i>
//                 </div>
//             </div>

//             <div
//                 ref={messagesRef}
//                 className="flex-1  overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar"
//                 style={{ height: 'calc(100vh - 122px - 76px)' }}
//             >
//                 {loading ? <div className="flex justify-center items-center h-full bg-[#0b2131]">
//                     <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//                     : messages.map((msg, idx) => (
//                         <div
//                             key={idx}
//                             className={`flex ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} group`}
//                             data-message-id={msg._id}
//                             data-sender-id={msg.senderId}
//                             data-seen={msg.seen ? 'true' : 'false'}
//                         >
//                             <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
//                                 <div
//                                     className={`rounded-xl text-[15px] break-words whitespace-pre-wrap max-w-[80vw] md:max-w-[60vw] ${msg.image ? '' : 'inline-block'}
//                   ${msg.senderId === authUser._id
//                                             ? 'bg-blue-600 text-white rounded-br-none'
//                                             : 'bg-[#18445f] text-white rounded-bl-none'}
//                   ${msg.image ? 'p-1' : 'px-3 py-2'}`}
//                                 >
//                                     {msg.image ? (
//                                         <div className="relative w-full max-w-[220px] aspect-[4/3] rounded-lg overflow-hidden mx-auto">
//                                             <img
//                                                 src={msg.image}
//                                                 alt="sent"
//                                                 className="w-full h-full object-cover rounded-lg"
//                                             />
//                                         </div>
//                                     ) : (
//                                         msg.text
//                                     )}
//                                 </div>

//                                 {msg.senderId === authUser._id && (
//                                     <div className="flex items-center gap-1.5 mt-0.5 h-4 relative">
//                                         <span className="absolute right-full mr-1 text-[11px] text-white/50 opacity-0 group-hover:opacity-100 whitespace-nowrap">
//                                             {new Date(msg.createdAt).toLocaleDateString('en-GB')}
//                                         </span>
//                                         <span className="text-[11px] text-white/70 whitespace-nowrap">
//                                             {new Date(msg.createdAt).toLocaleTimeString([], {
//                                                 hour: '2-digit',
//                                                 minute: '2-digit',
//                                             })}
//                                         </span>
//                                         <div className="flex justify-center items-center">
//                                             {msg.seen ? (
//                                                 <i className="ri-check-double-fill text-[#2df3e6] text-[16px]" />
//                                             ) : onlineUsers.includes(selectedUser._id) ? (
//                                                 <i className="ri-check-double-fill text-white/70 text-[16px]" />
//                                             ) : (
//                                                 <i className="ri-check-line text-white/70 text-[16px]" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {msg.senderId !== authUser._id && (
//                                     <div className="flex items-center gap-1 mt-0.5 h-4 relative">
//                                         <span className="text-[11px] text-white/70 whitespace-nowrap">
//                                             {new Date(msg.createdAt).toLocaleTimeString([], {
//                                                 hour: '2-digit',
//                                                 minute: '2-digit',
//                                             })}
//                                         </span>
//                                         <span className="text-[11px] text-white/50 opacity-0 group-hover:opacity-100 whitespace-nowrap ml-1">
//                                             {new Date(msg.createdAt).toLocaleDateString('en-GB')}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 <div ref={bottomRef} />
//             </div>

//             <div className="sticky bottom-0 z-10 px-4 py-3 border-t border-white/10 bg-[#0d283b]">
//                 {previewImage && (
//                     <div className="mb-3 relative w-28 h-28 rounded overflow-hidden border border-white/20">
//                         <img
//                             src={previewImage}
//                             alt="preview"
//                             className="w-full h-full object-cover rounded opacity-100"
//                         />
//                         {imageUploading && (
//                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                         )}
//                         <button
//                             onClick={() => !imageUploading && setPreviewImage(null)}
//                             className="absolute top-1 right-1 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
//                             aria-label="Close image"
//                             disabled={imageUploading}
//                         >
//                             <i className="ri-close-line text-sm" />
//                         </button>
//                     </div>
//                 )}

//                 <div className="flex items-center gap-3 sm:gap-3 relative sm:px-2">

//                     <label className="text-white/70 hover:text-white cursor-pointer flex-shrink-0">
//                         <i className="ri-image-add-line text-2xl sm:text-3xl"></i>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleSendImage}
//                         />
//                     </label>

//                     <div className="relative flex-shrink-0" ref={emojiRef}>
//                         <button
//                             onClick={() => setShowEmoji(!showEmoji)}
//                             className="text-white/70 hover:text-white"
//                         >
//                             <i className="ri-emotion-line text-2xl sm:text-3xl"></i>
//                         </button>
//                         {showEmoji && (
//                             <div className="absolute bottom-12 left-0 z-20">
//                                 <Suspense fallback={<div className="w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] bg-gray-800 rounded-lg" />}>
//                                     <EmojiPicker
//                                         theme="dark"
//                                         width={280}
//                                         height={360}
//                                         lazyLoadEmojis
//                                         previewConfig={{ showPreview: false }}
//                                         onEmojiClick={(emojiData) =>
//                                             setMessage((prev) => prev + emojiData.emoji)
//                                         }
//                                     />
//                                 </Suspense>
//                             </div>
//                         )}
//                     </div>

//                     <input
//                         ref={inputRef}
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         onKeyDown={handleKeyPress}
//                         placeholder="Type a message..."
//                         disabled={!!previewImage}
//                         className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-[#18445f] text-white placeholder-white/50 outline-none text-md min-w-0"
//                     />

//                     <button
//                         onClick={previewImage ? handleSendPreviewImage : sendMessage}
//                         disabled={previewImage ? false : !message.trim()}
//                         className={`rounded-full flex-shrink-0 transition ${previewImage || message.trim()
//                             ? 'text-blue-500 hover:text-blue-400'
//                             : 'text-gray-500'
//                             }`}
//                     >
//                         <i className="ri-send-plane-2-fill text-2xl sm:text-3xl"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatContainer;


import React, { useState, useEffect, useRef, lazy, Suspense, useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const ChatContainer = ({ setIsMedia }) => {
    const { messages, clearMessages, setSelectedUser, selectedUser, getSelectedUserMessages, sendMsgToSelectedUser, markMessageAsSeen } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const bottomRef = useRef();
    const emojiRef = useRef();
    const inputRef = useRef();
    const messagesRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedUser) {
                setLoading(true);
                await getSelectedUserMessages(selectedUser._id);
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedUser]);

    useEffect(() => {
        if (!loading && selectedUser && messages.length) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [loading, selectedUser, messages]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showEmoji && !emojiRef.current?.contains(e.target)) {
                setShowEmoji(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmoji]);

    useEffect(() => {
        if (!selectedUser || !messages.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.messageId;
                        const senderId = entry.target.dataset.senderId;

                        if (senderId === selectedUser._id && entry.target.dataset.seen === 'false') {
                            markMessageAsSeen(messageId);
                            entry.target.dataset.seen = 'true';
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        const unseenElements = Array.from(
            document.querySelectorAll(`[data-sender-id="${selectedUser._id}"][data-seen="false"]`)
        );

        unseenElements.forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, [messages, selectedUser]);

    const sendMessage = () => {
        if (!message.trim()) return;

        const msgToSend = message;
        setMessage('');
        setShowEmoji(false);
        inputRef.current?.focus();
        sendMsgToSelectedUser({ text: msgToSend });
    };


    const handleSendImage = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            return toast.error("Select an image file");
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const handleSendPreviewImage = async () => {
        if (previewImage) {
            setImageUploading(true);
            await sendMsgToSelectedUser({ image: previewImage });
            setImageUploading(false);
            setPreviewImage(null);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
<div className="flex flex-col h-screen bg-[#0b2131]">

<div className="sticky top-0 z-10 h-16 flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0b2131]">                <div className="flex items-center gap-3 relative">

                    <i
                        className="ri-arrow-left-line text-2xl text-white/70 hover:text-white cursor-pointer md:hidden"
                        onClick={() => {
                            setSelectedUser(null)
                            clearMessages();
                        }}
                    ></i>

                    <div className="relative">
                        <img
                            src={selectedUser.profilePic || '/images/default.png'}
                            alt={selectedUser.fullname}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        {onlineUsers.includes(selectedUser._id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0d283b] rounded-full"></span>
                        )}
                    </div>
                    <span className="text-md font-medium text-white">{selectedUser.fullname}</span>
                </div>

                <div onClick={() => setIsMedia(true)} className="flex items-center gap-3">
                    <i className="ri-information-line text-3xl text-white/70 hover:text-white cursor-pointer"></i>
                </div>
            </div>

            <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar"
            >
                {loading ? <div className="flex justify-center items-center h-full bg-[#0b2131]">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                    : messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'} group`}
                            data-message-id={msg._id}
                            data-sender-id={msg.senderId}
                            data-seen={msg.seen ? 'true' : 'false'}
                        >
                            <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`rounded-xl text-[15px] break-words whitespace-pre-wrap max-w-[80vw] md:max-w-[60vw] ${msg.image ? '' : 'inline-block'}
                  ${msg.senderId === authUser._id
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-[#18445f] text-white rounded-bl-none'}
                  ${msg.image ? 'p-1' : 'px-3 py-2'}`}
                                >
                                    {msg.image ? (
                                        <div className="relative w-full max-w-[220px] aspect-[4/3] rounded-lg overflow-hidden mx-auto">
                                            <img
                                                src={msg.image}
                                                alt="sent"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>

                                {msg.senderId === authUser._id && (
                                    <div className="flex items-center gap-1.5 mt-0.5 h-4 relative">
                                        <span className="absolute right-full mr-1 text-[11px] text-white/50 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                        <span className="text-[11px] text-white/70 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        <div className="flex justify-center items-center">
                                            {msg.seen ? (
                                                <i className="ri-check-double-fill text-[#2df3e6] text-[16px]" />
                                            ) : onlineUsers.includes(selectedUser._id) ? (
                                                <i className="ri-check-double-fill text-white/70 text-[16px]" />
                                            ) : (
                                                <i className="ri-check-line text-white/70 text-[16px]" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {msg.senderId !== authUser._id && (
                                    <div className="flex items-center gap-1 mt-0.5 h-4 relative">
                                        <span className="text-[11px] text-white/70 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        <span className="text-[11px] text-white/50 opacity-0 group-hover:opacity-100 whitespace-nowrap ml-1">
                                            {new Date(msg.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 z-10 h-20 flex-shrink-0 px-4 py-3 border-t border-white/10 bg-[#0b2131]">                {previewImage && (
                <div className="mb-3 relative w-28 h-28 rounded overflow-hidden border border-white/20">
                    <img
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded opacity-100"
                    />
                    {imageUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <button
                        onClick={() => !imageUploading && setPreviewImage(null)}
                        className="absolute top-1 right-1 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Close image"
                        disabled={imageUploading}
                    >
                        <i className="ri-close-line text-sm" />
                    </button>
                </div>
            )}

                <div className="flex items-center gap-3 sm:gap-3 relative sm:px-2">

                    <label className="text-white/70 hover:text-white cursor-pointer flex-shrink-0">
                        <i className="ri-image-add-line text-2xl sm:text-3xl"></i>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSendImage}
                        />
                    </label>

                    <div className="relative flex-shrink-0" ref={emojiRef}>
                        <button
                            onClick={() => setShowEmoji(!showEmoji)}
                            className="text-white/70 hover:text-white"
                        >
                            <i className="ri-emotion-line text-2xl sm:text-3xl"></i>
                        </button>
                        {showEmoji && (
                            <div className="absolute bottom-12 left-0 z-20">
                                <Suspense fallback={<div className="w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] bg-gray-800 rounded-lg" />}>
                                    <EmojiPicker
                                        theme="dark"
                                        width={280}
                                        height={360}
                                        lazyLoadEmojis
                                        previewConfig={{ showPreview: false }}
                                        onEmojiClick={(emojiData) =>
                                            setMessage((prev) => prev + emojiData.emoji)
                                        }
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={!!previewImage}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-[#18445f] text-white placeholder-white/50 outline-none text-md min-w-0"
                    />

                    <button
                        onClick={previewImage ? handleSendPreviewImage : sendMessage}
                        disabled={previewImage ? false : !message.trim()}
                        className={`rounded-full flex-shrink-0 transition ${previewImage || message.trim()
                            ? 'text-blue-500 hover:text-blue-400'
                            : 'text-gray-500'
                            }`}
                    >
                        <i className="ri-send-plane-2-fill text-2xl sm:text-3xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;

