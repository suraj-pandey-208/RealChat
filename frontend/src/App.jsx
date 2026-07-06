import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import getOtherUsers from "./customHook/useOtherUsers";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useCurrentUser from "./customHook/useCurrentUser";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  useCurrentUser();
  getOtherUsers();

  const dispatch = useDispatch();

  const { userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socketio.on("hello", (mess) => {
        console.log(mess);
      });

      return () => {
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/profile" replace />}
        />

        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" replace />}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;