import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../apiCalls/message";
import { hideLoader, showLoader } from "./../Features/loaderSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { clearUnreadMessageCount } from "../apiCalls/chat";
import { store } from "../Features/Store";
import { setAllChats, setSelectedChat } from "../Features/userSlice";
import EmojiPicker from "emoji-picker-react";

function ChatArea({ socket }) {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const selectedUser = selectedChat?.members.find((u) => u._id !== user._id);
  const [message, setMessage] = useState("");
  const [allmessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showemojiPicker, setShowemojiPicker] = useState(false);
  const [data, setData] = useState(null);
  const [formattedTimestamps, setFormattedTimestamps] = useState({}); // State for dynamic timestamps

  const sendImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      sendMessage(reader.result);
    };
  };

  const sendMessage = async (image) => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image,
      };

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat.members.map((m) => m._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      const response = await createNewMessage(newMessage);
      if (response.success) {
        setMessage("");
        setShowemojiPicker(false);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());
      if (response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chatId: selectedChat._id,
        members: selectedChat.members.map((m) => m._id),
      });
      const response = await clearUnreadMessageCount(selectedChat._id);
      if (response.success) {
        allChats.map((chat) => {
          if (chat._id == selectedChat._id) {
            return response.data;
          }
          return chat;
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Effect to reset emoji picker when selectedChat changes
  useEffect(() => {
    setShowemojiPicker(false); // Close emoji picker when switching chats
  }, [selectedChat]);

  // Effect for message retrieval and socket events
  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }
    socket.off("receive-message").on("receive-message", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat._id === message.chatId) {
        setAllMessages((prevmsg) => [...prevmsg, message]);
      }
      if (selectedChat._id === message.chatId && message.sender !== user._id) {
        clearUnreadMessages();
      }
    });
    socket.on("message-count-cleared", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if (selectedChat._id === data.chatId) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === data.chatId) {
            return { ...chat, unreadMessageCount: 0 };
          }
          return chat;
        });
        dispatch(setAllChats(updatedChats));

        setAllMessages((prevMsgs) => {
          return prevMsgs.map((msg) => {
            return { ...msg, read: true };
          });
        });
      }
    });
    socket.on("started-typing", (data) => {
      setData(data);
      if (selectedChat?._id === data.chatId && data.sender !== user._id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });
  }, [selectedChat]);

  // Effect to update timestamps periodically
  const updateTimestamps = useCallback(() => {
    const now = moment();
    const newTimestamps = {};
    allmessages.forEach((msg) => {
      const timestamp = moment(msg.createdAt);
      const diff = now.diff(timestamp, "days");

      if (diff < 1) {
        newTimestamps[msg._id] = `Today ${timestamp.format("hh:mm A")}`;
      } else if (diff === 1) {
        newTimestamps[msg._id] = `Yesterday ${timestamp.format("hh:mm A")}`;
      } else {
        newTimestamps[msg._id] = timestamp.format("MMM D, hh:mm A");
      }
    });
    setFormattedTimestamps(newTimestamps);
  }, [allmessages]);

  useEffect(() => {
    updateTimestamps(); // Initial calculation
    const interval = setInterval(updateTimestamps, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [updateTimestamps]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allmessages, isTyping]);

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMM D, hh:mm A");
    }
  };

  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">{selectedUser?.username}</div>
          <div className="main-chat-area" id="main-chat-area">
            {allmessages.map((msg) => {
              const isCurrentSender = msg.sender === user._id;
              return (
                <div
                  className="message-container"
                  style={
                    isCurrentSender
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                >
                  <div>
                    <div
                      className={
                        isCurrentSender ? "send-message" : "received-message"
                      }
                    >
                      <div>{msg.text}</div>
                      {msg.image && (
                        <img src={msg.image} alt="image" height="120" width="120" />
                      )}
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentSender ? { float: "right" } : { float: "left" }
                      }
                    >
                      {formattedTimestamps[msg._id] || formatTime(msg.createdAt)}{" "}
                      {isCurrentSender && msg.read && (
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="typing-indicator">
              {isTyping &&
                selectedChat?.members.map((m) => m._id).includes(data?.sender) && (
                  <i>typing...</i>
                )}
            </div>
          </div>
          {showemojiPicker && (
            <div
              style={{
                position: "fixed",
                bottom: "110px", // Space above the input area
                right: window.innerWidth < 600 ? "10px" : "150px",
                zIndex: 10, // Ensure it’s above other content
                width: window.innerWidth < 600 ? "260px" : "300px",
                height: window.innerWidth < 600 ? "300px" : "400px",
              }}
            >
              <EmojiPicker
                style={{ width: "100%", height: "100%" }}
                onEmojiClick={(e) => setMessage(message + e.emoji)}
              ></EmojiPicker>
            </div>
          )}
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit("user-typing", {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map((m) => m._id),
                  sender: user._id,
                });
              }}
            />
            <label htmlFor="file">
              <i className="fa fa-picture-o send-image-btn"></i>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                accept="image/jpg,image/png,image/jpeg,image/gif"
                onChange={sendImage}
              />
            </label>
            <button
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick={() => setShowemojiPicker(!showemojiPicker)}
            ></button>
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;