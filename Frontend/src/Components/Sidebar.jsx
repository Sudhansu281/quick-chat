// import React, { useState } from "react";
// import "./mystyles.css";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import IconButton from "@mui/material/IconButton";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import NightlightIcon from "@mui/icons-material/Nightlight";
// import SearchIcon from "@mui/icons-material/Search";
// import Conversationitem from "./Conversationitem";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme } from "../Features/ThemeSlice";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// function Sidebar() {
//   const lightTheme = useSelector((state) => state.themeKey);
//   const dispatch = useDispatch();

//   const [conversation, setConversation] = useState([
//     {
//       name: "Test#1",
//       lastMessage: "Last message #1",
//       timeStamp: "today",
//     },
//     {
//       name: "Test#2",
//       lastMessage: "Last message #2",
//       timeStamp: "today",
//     },
//     {
//       name: "Test#3",
//       lastMessage: "Last message #3",
//       timeStamp: "today",
//     },
//   ]);
//   const navigate = useNavigate();
//   return (
//     <div className="sidebar-container">
//       <div className={"sb-header" + (lightTheme ? "" : " dark")}>
//         <div>
//           <IconButton>
//             <AccountCircleIcon
//               className={"icon" + (lightTheme ? "" : " dark")}
//             />
//           </IconButton>
//         </div>
//         <div>
//           <IconButton
//             onClick={() => {
//               navigate("users");
//             }}
//           >
//             <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               navigate("groups");
//             }}
//           >
//             <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
//           </IconButton>
//           <IconButton>
//             <AddCircleIcon
//               className={"icon" + (lightTheme ? "" : " dark")}
//               onClick={() => {
//                 navigate("create-groups");
//               }}
//             />
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               dispatch(toggleTheme());
//             }}
//           >
//             {lightTheme && <NightlightIcon className="icon" />}
//             {!lightTheme && (
//               <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
//             )}
//           </IconButton>
//           <IconButton
//             onClick={() => {
//               localStorage.removeItem("userData");
//               navigate("/login");
//             }}
//           >
//             <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
//           </IconButton>
//         </div>
//       </div>
//       <div className={"sb-search" + (lightTheme ? "" : " dark")}>
//         <IconButton>
//           <SearchIcon />
//         </IconButton>
//         <input
//           placeholder="search"
//           className={"search-box" + (lightTheme ? "" : " dark")}
//         />
//       </div>
//       <div className={"sb-conversation" + (lightTheme ? "" : " dark")}>
//         {conversation.map((conversation) => {
//           return <Conversationitem props={conversation} />;
//         })}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
import { useState } from "react";
import Search from "./Search";
import UserList from "./UserList";

function Sidebar({socket,onlineUser}) {
  const [searchKey, setSearchKey] = useState("");
  return (
    <div className="app-sidebar">
      <Search searchKey={searchKey} setSearchKey={setSearchKey}></Search>
      <UserList searchKey={searchKey} socket={socket} onlineUser={onlineUser}/>
    </div>
  );
}

export default Sidebar;
