import React from "react";
import "./Index.css";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";

import Signup from "./Components/Signup";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Components/ProtectedRoute";
import Loader from "./Components/Loader";
import { useSelector } from "react-redux";
import Home from "./Components/Home";

function App() {
  const { loader } = useSelector((state) => state.loaderReducer);
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      {/* <Login/>
      <MainContainer/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainContainer />
            </ProtectedRoute>
          }
        >
          <Route path="chat" element={<Chatarea />}></Route>
        </Route>
      </Routes> */}
       <Routes>
          <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute> }>
          </Route>
          {/* <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute> }>
          </Route> */}
          <Route path="/login" element={<Login /> }></Route>
          <Route path="/signup" element={<Signup /> }></Route>
        </Routes>
    </div>
  );
}

export default App;
