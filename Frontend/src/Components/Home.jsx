import React, { useEffect, useState } from "react";
// import ChatArea from "./components/chat";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("https://chat-app-server-hsf9.onrender.com");

function Home() {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUser, setOnlineUser] = useState([]);
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("user-login", user._id);
      socket.on("online-users", (onlineUser) => {
        setOnlineUser(onlineUser);
      });
      socket.on("online-users-updated", (onlineusers) => {
        setOnlineUser(onlineusers);
      });
      return () => {
      socket.off("online-users");
      socket.off("online-users-updated");
    };
    }
  }, [user]);

  return (
    <div>
      <div className="home-page">
        <Header socket={socket}></Header>
        <div className="main-content">
          <Sidebar socket={socket} onlineUser={onlineUser}></Sidebar>
          {selectedChat && <ChatArea socket={socket}></ChatArea>}
        </div>
      </div>
    </div>
  );
}

export default Home;
