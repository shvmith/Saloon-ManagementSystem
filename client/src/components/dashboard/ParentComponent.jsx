import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component
import { useDispatch } from "react-redux";
import {
  signOutUserstart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice"; // Import your actions

const ParentComponent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserstart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleSignOut={handleSignOut}
      />
      {/* Other components */}
    </div>
  );
};

export default ParentComponent;
