import { createContext, useState } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = url;

export const AuthProvider = ({ children }) => {
   const [token, setToken] = useState(localStorage.getItem("token"))
   const [authUser, setAuthUser] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [socket, setSocket] = useState(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate()

   // check if user is autheticated or not

   const checkAuth = async () => {
      try {
         const { data } = await axios.get('/api/auth/check')
         if (data.success) {
            setAuthUser(data.user)
            connectSocket(data.user)
         }
      } catch (error) {
         toast.error(error.message)
      } finally {
         setLoading(false);
      }
   }

   // Connect socket function to handle socket connection
   // and online users updates

   const connectSocket = (userData) => {
      if (!userData || socket?.connected) return
      const newSocket = io(url, {
         query: { userId: userData._id }
      })
      setSocket(newSocket)
      newSocket.on("getOnlineUsers", (userIds) => {
         setOnlineUsers(userIds)
      })
   }

   const login = async (state, credentials) => {
      try {
         const { data } = await axios.post(`/api/auth/${state}`, credentials)
         if (data.success) {
            const { user, token, message } = data;
            setAuthUser(user)
            setToken(token)
            connectSocket(user)
            axios.defaults.headers.common["token"] = token;
            localStorage.setItem("token", token)
            toast.success(message)
            navigate('/')
         }
         else {
            toast.error(data.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   const logout = async () => {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      delete axios.defaults.headers.common["token"];
      toast.success("Successfully logout");

      if (socket) {
         socket.disconnect();
      }
   };

   // Update profile function

   const updateProfile = async (body) => {
      try {
         const { data } = await axios.put('/api/auth/update-profile', body)
         if (data.success) {
            setAuthUser(data.user)
            toast.success("Profile Updated Successfully")
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   useEffect(() => {
      if (token) {
         axios.defaults.headers.common['token'] = token;
         checkAuth();
      } else {
         setLoading(false);
      }
   }, [token]);


   const value = {
      axios,
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile,
      loading
   }
   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )
}