import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios } = useContext(AuthContext)

    // Get all users for sideBar
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getSelectedUserMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendMsgToSelectedUser = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Message send failed");
        }
    };

    // Function to mark message as seen and emit to sender
    const markMessageAsSeen = async (messageId) => {
        try {
            await axios.put(`/api/messages/mark/${messageId}`);
        } catch (err) {
            console.error("Failed to mark as seen", err);
        }
    };

    // function to get messages of user in real time
    const subscribeToMessages = async () => {
        if (!socket) return;

        // Listen for new messages
        socket.on("newMessage", async (newMessage) => {
            if (selectedUser && newMessage.senderId == selectedUser._id) {
                // Agar message ka sender currently selected user hai:
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                // Mark message as seen
                await markMessageAsSeen(newMessage._id);
            } else {
                // Agar message kisi aur se aaya hai (selectedUser nahi hai):
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }))
            }
        });

        // Listen for message seen updates (NEW EVENT)
        socket.on("messageSeen", (updatedMessage) => {
            setMessages((prev) => 
                prev.map(msg => 
                    msg._id === updatedMessage._id 
                        ? { ...msg, seen: true } 
                        : msg
                )
            );
        });
    }

    const unSubscribeMessages = () => {
        if (socket) {
            socket.off("newMessage");
            socket.off("messageSeen"); // Clean up seen listener too
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unSubscribeMessages()
    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        sendMsgToSelectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getSelectedUserMessages,
        markMessageAsSeen, 
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}


// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unseenMessages, setUnseenMessages] = useState({});

//   const { socket, axios } = useContext(AuthContext);

//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/messages/users");
//       if (data.success) {
//         setUsers(data.users);
//         setUnseenMessages(data.unseenMessages);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const getSelectedUserMessages = async (userId) => {
//     try {
//       const { data } = await axios.get(`/api/messages/${userId}`);
//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sendMsgToSelectedUser = async (messageData) => {
//     try {
//       const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
//       if (data.success) {
//         setMessages((prev) => [...prev, data.newMessage]);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Message send failed");
//     }
//   };

//   const subscribeToMessages = () => {
//     if (!socket) return;

//     socket.on("newMessage", async (newMessage) => {
//       if (selectedUser && newMessage.senderId == selectedUser._id) {
//         newMessage.seen = true;
//         setMessages((prev) => [...prev, newMessage]);
//         try {
//           await axios.put(`/api/messages/mark/${newMessage._id}`);
//         } catch (err) {
//           console.error("Failed to mark as seen", err);
//         }
//       } else {
//         setUnseenMessages((prev) => ({
//           ...prev,
//           [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
//         }));
//       }
//     });

//     socket.on("messagesSeen", (messageIds) => {
//       setMessages((prev) =>
//         prev.map((msg) => (messageIds.includes(msg._id) ? { ...msg, seen: true } : msg))
//       );
//     });
//   };

//   const unSubscribeMessages = () => {
//     if (socket) {
//       socket.off("newMessage");
//       socket.off("messagesSeen");
//     }
//   };

//   useEffect(() => {
//     subscribeToMessages();
//     return () => unSubscribeMessages();
//   }, [socket, selectedUser]);

//   const value = {
//     messages,
//     users,
//     selectedUser,
//     getUsers,
//     sendMsgToSelectedUser,
//     setSelectedUser,
//     unseenMessages,
//     setUnseenMessages,
//     getSelectedUserMessages,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };
