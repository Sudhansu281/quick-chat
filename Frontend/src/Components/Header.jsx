import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header({ socket }) {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  //   function getFullname(){
  //     let fname = user?.username.at(0);
  //     return fname;
  // }
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    socket.emit("user-offline", user._id);
  };
  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        ChatLink
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{userData?.name}</div>
        {user?.profilePic && (
          <img
            src={user.profilePic}
            alt="profile-pic"
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
          ></img>
        )}
        {!user?.profilePic && (
          <div
            className="logged-user-profile-pic"
            onClick={() => navigate("/profile")}
          >
            {userData?.name[0]}
          </div>
        )}
        <button className="logout-button" onClick={logout}>
          <i className="fa fa-power-off"></i>
        </button>
      </div>
    </div>
  );
}

export default Header;
