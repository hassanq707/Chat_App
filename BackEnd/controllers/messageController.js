import USER from '../models/userModel.js';
import MESSAGE from '../models/MessageModel.js';
import cloudinary from '../config/cloudinary.js';
import {io , userSocketMap} from '../index.js'

// Get all users except logged in user
const getUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await USER.find({ _id: { $ne: userId } }).select("-password");

        // count number of messages not seen
        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await MESSAGE.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);

        res.json({ success: true, users: filteredUsers, unseenMessages });

    } catch (error) {
        res.json({ success: false, message: "Error Fetching all users" });
    }
};

// Get all selected user messages
const getSelectedUserMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await MESSAGE.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });

        // Mark all messages from selected user as seen
        const updatedMessages = await MESSAGE.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false }, 
            { seen: true }
        );

        // If any messages were marked as seen, notify the sender
        if (updatedMessages.modifiedCount > 0) {
            const senderSocketId = userSocketMap[selectedUserId];
            if (senderSocketId) {
                // Get the updated messages to send back
                const seenMessages = await MESSAGE.find({
                    senderId: selectedUserId, 
                    receiverId: myId
                });
                
                // Emit each seen message individually
                seenMessages.forEach(msg => {
                    if (msg.seen) {
                        io.to(senderSocketId).emit("messageSeen", msg);
                    }
                });
            }
        }

        res.json({ success: true, messages });

    } catch (error) {
        res.json({ success: false, message: "Error Fetching user messages" });
    }
};

// Api to mark messages as seen using message id
const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await MESSAGE.findByIdAndUpdate(id, { seen: true }, { new: true });

        if (!message) {
            return res.json({ success: false, message: "Message not found" });
        }

        // emit seen status to sender
        const senderSocketId = userSocketMap[message.senderId];
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageSeen", message);
        }

        res.json({ success: true, message: "Message marked as seen" });
    } catch (error) {
        console.error("Mark message seen error:", error);
        res.json({ success: false, message: "Error marking message seen" });
    }
};

const sendMsgToSelectedUser = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id

        console.log("Image received?", image?.substring(0, 30)) // ✅ for debugging

        let imageUrl;
        if (image) {
            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;
        }

        const newMessage = await MESSAGE.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.json({ success: true, newMessage });

    } catch (error) {
        console.error("Message send error:", error);
        res.json({ success: false, message: "Error sending message" });
    }
};

export {
    getUsers,
    getSelectedUserMessages,
    markMessageAsSeen,
    sendMsgToSelectedUser,
};



// import USER from '../models/userModel.js';
// import MESSAGE from '../models/MessageModel.js';
// import cloudinary from '../config/cloudinary.js';
// import {io , userSocketMap} from '../index.js'

// // Get all users except logged in user
// const getUsers = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const filteredUsers = await USER.find({ _id: { $ne: userId } }).select("-password");

//         const unseenMessages = {};

//         const promises = filteredUsers.map(async (user) => {
//             const messages = await MESSAGE.find({
//                 senderId: user._id,
//                 receiverId: userId,
//                 seen: false,
//             });

//             if (messages.length > 0) {
//                 unseenMessages[user._id] = messages.length;
//             }
//         });

//         await Promise.all(promises);

//         res.json({ success: true, users: filteredUsers, unseenMessages });
//     } catch (error) {
//         res.json({ success: false, message: "Error Fetching all users" });
//     }
// };

// // Get all selected user messages
// const getSelectedUserMessages = async (req, res) => {
//     try {
//         const { id: selectedUserId } = req.params;
//         const myId = req.user._id;

//         const messages = await MESSAGE.find({
//             $or: [
//                 { senderId: myId, receiverId: selectedUserId },
//                 { senderId: selectedUserId, receiverId: myId }
//             ]
//         });

//         // Mark all messages from selected user as seen
//         const updatedMessages = await MESSAGE.updateMany(
//             { senderId: selectedUserId, receiverId: myId, seen: false }, 
//             { seen: true }
//         );

//         // If any messages were marked as seen, notify the sender
//         if (updatedMessages.modifiedCount > 0) {
//             const senderSocketId = userSocketMap[selectedUserId];
//             if (senderSocketId) {
//                 // Get the updated messages to send back
//                 const seenMessages = await MESSAGE.find({
//                     senderId: selectedUserId, 
//                     receiverId: myId
//                 });
                
//                 // Emit each seen message individually
//                 seenMessages.forEach(msg => {
//                     if (msg.seen) {
//                         io.to(senderSocketId).emit("messageSeen", msg);
//                     }
//                 });
//             }
//         }

//         res.json({ success: true, messages });

//     } catch (error) {
//         res.json({ success: false, message: "Error Fetching user messages" });
//     }
// };

// // Api to mark messages as seen using message id
// const markMessageAsSeen = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const message = await MESSAGE.findByIdAndUpdate(id, { seen: true }, { new: true });

//         if (!message) {
//             return res.json({ success: false, message: "Message not found" });
//         }

//         // emit seen status to sender
//         const senderSocketId = userSocketMap[message.senderId];
//         if (senderSocketId) {
//             io.to(senderSocketId).emit("messageSeen", message);
//         }

//         res.json({ success: true, message: "Message marked as seen" });
//     } catch (error) {
//         console.error("Mark message seen error:", error);
//         res.json({ success: false, message: "Error marking message seen" });
//     }
// };

// const sendMsgToSelectedUser = async (req, res) => {
//     try {
//         const { text, image } = req.body;
//         const receiverId = req.params.id;
//         const senderId = req.user._id

//         console.log("Image received?", image?.substring(0, 30)) // ✅ for debugging

//         let imageUrl;
//         if (image) {
//             const uploadResult = await cloudinary.uploader.upload(image);
//             imageUrl = uploadResult.secure_url;
//         }

//         const newMessage = await MESSAGE.create({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl
//         });

//         // Emit the new message to the receiver's socket
//         const receiverSocketId = userSocketMap[receiverId];
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('newMessage', newMessage);
//         }

//         res.json({ success: true, newMessage });

//     } catch (error) {
//         console.error("Message send error:", error);
//         res.json({ success: false, message: "Error sending message" });
//     }
// };

// export {
//     getUsers,
//     getSelectedUserMessages,
//     markMessageAsSeen,
//     sendMsgToSelectedUser,
// };