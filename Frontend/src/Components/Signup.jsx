import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../apiCalls/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "./../Features/loaderSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setuser] = useState({
    username: "",
    email: "",
    password: "",
  });
  async function onFormSubmit(e) {
    e.preventDefault();
    let response = null;
    try {
       dispatch(showLoader());
       response = await signupUser(user);
       dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        // localStorage.setItem("userData",JSON.stringify(response.user));
        // localStorage.setItem("token",response.user.token);
        navigate("/");
      } else {
        toast.success(response.message);
      }
    } catch (err) {
      dispatch(hideLoader());
      toast.success(response.message);
    }
  }
  return (
    <div>
      <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
          <div className="card_title">
            <h1>Create Account</h1>
          </div>
          <div className="form">
            <form onSubmit={onFormSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setuser({ ...user, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setuser({ ...user, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => setuser({ ...user, password: e.target.value })}
              />
              <button>Sign Up</button>
            </form>
          </div>
          <div className="card_terms">
            <span>
              Already have an account?
              <Link to="/login">Login Here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
