import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../apiCalls/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "./../Features/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setuser] = useState({
    email: "",
    password: "",
  });
  async function onFormSubmit(e) {
    e.preventDefault();
    let res = null;
    try {
      dispatch(showLoader());
      res = await loginUser(user);
      dispatch(hideLoader());
      if (res.success) {
        toast.success(res.message);
        localStorage.setItem("userData", JSON.stringify(res.user));
        localStorage.setItem("token", res.user.token);
        navigate("/");
      } else {
        toast.success(res.message);
      }
    } catch (err) {
      dispatch(hideLoader());
      toast.success(res.message);
    }
  }
  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <form onSubmit={onFormSubmit}>
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
            <button>Login</button>
          </form>
        </div>
        <div className="card_terms">
          <span>
            Don't have an account yet?
            <Link to="/signup">Signup Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
