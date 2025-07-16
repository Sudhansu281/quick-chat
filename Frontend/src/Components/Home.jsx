import React, { useEffect } from "react";
// import ChatArea from "./components/chat";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

function Home() {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
    }
  }, [user]);

  return (
    <div>
      <div className="home-page">
        <Header></Header>
        <div className="main-content">
          <Sidebar></Sidebar>
          {selectedChat && <ChatArea socket={socket}></ChatArea>}
        </div>
      </div>
    </div>
  );
}

export default Home;
