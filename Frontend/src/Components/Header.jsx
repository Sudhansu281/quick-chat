import { useDispatch, useSelector } from "react-redux";

function Header() {
//   const { user } = useSelector((state) => state.userReducer);
    const userData = JSON.parse(localStorage.getItem("userData"));
    //   function getFullname(){
    //     let fname = user?.username.at(0);
    //     return fname;
    // }
  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quick Chat
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{ userData?.name }</div>
        <div className="logged-user-profile-pic">{userData?.name[0]}</div>
      </div>
    </div>
  );
}

export default Header;
