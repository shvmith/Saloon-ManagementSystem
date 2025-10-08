import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUsers,
  FaBox,
  FaClipboardList,
  FaTags,
  FaChartLine,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { MdFeedback } from "react-icons/md";
import { logout } from "../../features/auth/authslices";
import { toast } from "react-toastify";
import logo from "./../../assets/img/logo-removebg-preview.png";

const sidebarVariants = {
  open: {
    width: "280px",
    transition: { type: "spring", stiffness: 50 },
  },
  closed: {
    width: "70px",
    transition: { type: "spring", stiffness: 50 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.3 } },
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(location.pathname);

  const menuItems = [
    { name: "Dashboard", path: "/manager", icon: <FaChartLine /> },
    { name: "Users", path: "/manager/user-management", icon: <FaUsers /> },
    {
      name: "Inventory",
      path: "/manager/inventory-management",
      icon: <FaBox />,
    },
    {
      name: "Appointments",
      path: "/manager/appointment-management",
      icon: <FaClipboardList />,
    },
    {
      name: "Service & Packages",
      path: "/manager/Service-management",
      icon: <FaTags />,
    },
    {
      name: "Feedback",
      path: "/manager/Feedback-management",
      icon: <MdFeedback />,
    },
    { name: "Profile", path: "/manager/profile", icon: <FaUserCircle /> },
  ];

  const handleSignOut = () => {
    try {
      localStorage.removeItem("token");
      dispatch(logout());
      toast.success("Signed out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.aside
      className="bg-SecondaryColor pl-4 h-screen fixed left-0 top-0 rounded-tr-3xl overflow-hidden z-20"
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      {/* Logo and Toggle Button */}
      <div className="flex flex-col items-center">
        <motion.div
          className="flex items-center justify-between w-full p-4"
          variants={contentVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
        >
          {isOpen ? (
            <>
              {/* Logo */}
              <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-ExtraDarkColor">
          GlowSuite Salon
        </div>
              </div>
              {/* Close Button (visible in open mode) */}
              <button onClick={toggleSidebar} className="text-DarkColor">
                <FaBars className="text-2xl ml-6 text-red-500" />
              </button>
            </>
          ) : null}
        </motion.div>

        {/* Menu Icon (visible only in closed mode) */}
        {!isOpen && (
          <button
            onClick={toggleSidebar}
            className="text-DarkColor w-full flex justify-center"
          >
            <FaBars className="text-2xl" /> {/* Menu Icon */}
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-4 mt-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center text-DarkColor p-2 rounded-l-full transition-all duration-300 ${
                selected === item.path
                  ? "bg-PrimaryColor text-DarkColor"
                  : "hover:bg-DarkColor hover:text-SecondaryColor"
              } ${!isOpen ? "justify-center" : "justify-start"}`}
              onClick={() => setSelected(item.path)}
            >
              <span className={`text-xl ${isOpen ? "mr-3" : "mr-0"}`}>
                {item.icon}
              </span>
              {isOpen && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* SignOut Button styled as other menu items */}
      <div className="absolute bottom-0 w-full">
        <button
          className={`flex items-center text-DarkColor p-2 rounded-l-full transition-all duration-300 w-full ${
            selected === "/logout"
              ? "bg-PrimaryColor text-DarkColor"
              : "hover:bg-DarkColor hover:text-ExtraDarkColor"
          } ${!isOpen ? "justify-center" : "justify-start"}`}
          onClick={handleSignOut}
        >
          <span className={`text-xl ${isOpen ? "mr-3" : "mr-0"}`}>
            <IoIosLogOut />
          </span>
          {isOpen && <span>LogOut</span>}
        </button>
      </div>
    </motion.aside>
  );
}