import { createNewChat } from "../apiCalls/chat";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../Features/loaderSlice";
import { setAllChats, setSelectedChat } from "../Features/userSlice";
import toast from "react-hot-toast";
import moment from "moment";

function UserList({ searchKey }) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);
  // console.log("UserList users:", allUsers);

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
      toast.error(response.message);
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
    }
  };

  const getLastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );

    if (!chat || !chat?.lastMessage) {
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

    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          {" "}
          {chat.unreadMessageCount}{" "}
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
    return allUsers.filter(user => {
      return (
        user.username.toLowerCase().includes(searchKey.toLowerCase())
      );
    });
  }
}


  return getdata()
    .map(obj => {
      let user = obj;
      if(obj.members){
         user = obj.members.find(mem => mem._id !== currentUser._id);
      }
      if (!user) return null; // skip rendering if user is undefined
      return <div
          className={isSelected(user) ? "selected-user" : "user-search-filter"}
          key={user._id}
          onClick={() => openChat(user._id)}
        >
          <div className="filtered-user">
            <div className="filter-user-display">
              {/* <img src={user.profilePic} alt="Profile Pic" className="user-profile-pic" /> */}
              <div className="user-default-profile-pic">
                {user?.username?.charAt(0)}
              </div>
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
      
  });
}

export default UserList;
