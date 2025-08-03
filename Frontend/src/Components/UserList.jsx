import { createNewChat } from "../apiCalls/chat";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../Features/loaderSlice";
import { setAllChats, setSelectedChat } from "../Features/userSlice";
import toast from "react-hot-toast";
import moment from "moment";
import { useEffect } from "react";

function UserList({ searchKey, socket, onlineUser }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);

  const isSelected = (user) => {
    if (selectedChat) {
      return selectedChat.members.map((m) => m._id).includes(user._id);
    }
    return false;
  };

  const dispatch = useDispatch();

  const startNewChat = async (searchedUserId) => {
    let response = null;
    try {
      dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [...allChats, newChat];
        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
      }
    } catch (error) {
      toast.error(response?.message || "Failed to start chat");
      dispatch(hideLoader());
    }
  };

  const openChat = (selectedUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(selectedUserId)
    );
    if (chat) {
      dispatch(setSelectedChat(chat));
      socket.emit("clear-unread-messages", {
        chatId: chat._id,
        members: chat.members.map((m) => m._id),
      });
    }
  };

  const getLastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );
    console.log(`getLastMessage for user ${userId}:`, chat?.lastMessage); // Debug
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const msgPrefix =
        chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
      return msgPrefix + chat?.lastMessage?.text?.substring(0, 25);
    }
  };

  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );
    if (!chat || !chat?.lastMessage) {
      return "";
    } else {
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
    }
  };

  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );
    console.log(`getUnreadMessageCount for user ${userId}:`, chat?.unreadMessageCount); // Debug
    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          {chat.unreadMessageCount}
        </div>
      );
    } else {
      return "";
    }
  };

  function getdata() {
    if (searchKey === "") {
      return allChats;
    } else {
      return allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchKey.toLowerCase())
      );
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleSetMessageCount = (message) => {
      console.log("Received set-message-count:", message); // Debug
      dispatch((dispatch, getState) => {
        const { allChats, selectedChat, user: currentUser } = getState().userReducer;

        const updatedChats = allChats.map((chat) => {
          if (chat._id === message.chatId) {
            const updatedChat = {
              ...chat,
              lastMessage: message, // Always update lastMessage
            };
            // Only increment unread count for receiver when chat is not selected
            if (
              message.sender !== currentUser._id &&
              selectedChat?._id !== message.chatId
            ) {
              updatedChat.unreadMessageCount = (chat?.unreadMessageCount || 0) + 1;
            }
            return updatedChat;
          }
          return chat;
        });

        // Reorder chats to put the latest chat on top
        const latestChat = updatedChats.find((chat) => chat._id === message.chatId);
        if (latestChat) {
          const otherChats = updatedChats.filter((chat) => chat._id !== message.chatId);
          dispatch(setAllChats([latestChat, ...otherChats]));
        } else {
          console.warn(`Chat with ID ${message.chatId} not found in allChats`);
          dispatch(setAllChats(updatedChats));
        }
      });
    };

    const handleMessageCountCleared = (data) => {
      console.log("Received message-count-cleared:", data); // Debug
      dispatch((dispatch, getState) => {
        const { allChats } = getState().userReducer;
        const updatedChats = allChats.map((chat) => {
          if (chat._id === data.chatId) {
            return { ...chat, unreadMessageCount: 0 };
          }
          return chat;
        });
        dispatch(setAllChats(updatedChats));
      });
    };

    socket.on("set-message-count", handleSetMessageCount);
    socket.on("message-count-cleared", handleMessageCountCleared);

    // Cleanup listeners on unmount
    return () => {
      socket.off("set-message-count", handleSetMessageCount);
      socket.off("message-count-cleared", handleMessageCountCleared);
    };
  }, [socket, dispatch]);

  if (!currentUser) return null;

  console.log("UserList allChats:", allChats); // Debug
  return getdata().map((obj) => {
    let user = obj;
    if (obj.members) {
      user = obj.members.find((mem) => mem._id !== currentUser._id);
    }
    if (!user) return null; // Skip rendering if user is undefined
    return (
      <div
        className={isSelected(user) ? "selected-user" : "user-search-filter"}
        key={user._id}
        onClick={() => openChat(user._id)}
      >
        <div className="filtered-user">
          <div className="filter-user-display">
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="user-profile-image"
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              />
            )}
            {!user.profilePic && (
              <div
                className={
                  isSelected(user)
                    ? "user-selected-avatar"
                    : "user-default-avatar"
                }
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="filter-user-details">
              <div className="user-display-name">{user?.username}</div>
              <div className="user-display-email">
                {getLastMessage(user._id) || user?.email}
              </div>
            </div>
            <div>
              <div>{getUnreadMessageCount(user._id)}</div>
              <div className="last-message-timestamp">
                {getLastMessageTimeStamp(user._id)}
              </div>
            </div>
            {!allChats.find((chat) =>
              chat.members.map((m) => m._id).includes(user._id)
            ) && (
              <div className="user-start-chat">
                <button
                  className="user-start-chat-btn"
                  onClick={() => startNewChat(user._id)}
                >
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
}
export default UserList;