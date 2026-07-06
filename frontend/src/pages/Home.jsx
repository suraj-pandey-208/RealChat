import React from "react";
import SideBar from "../components/SideBar";
import Message from "../components/MessageArea";
import useOtherUsers from "../customHook/useOtherUsers";
import useGetMessages from "../customHook/useGetMessages";

function Home() {
  useOtherUsers();
useGetMessages()
  return (
    <div className="flex h-screen">
      <SideBar />
      <Message />
    </div>
  );
}

export default Home;