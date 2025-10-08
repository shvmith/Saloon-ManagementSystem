// DashboardLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header"; // Add the Header component
import { Route, Routes } from "react-router-dom";
import DashboardOverview from "./Dashboard";
import CreateInventory from "../../pages/Inventory/CreateInventory";
import EditInventory from "../../pages/Inventory/EditInventory";
import InventoryManagement from "./dasboard/InventoryManagement";
import FeedbackManager from "./dasboard/FeedbackManager";
import AppointmentManager from "./dasboard/AppointmentManager";
import Service_and_PackageManager from "./dasboard/Service_and_PackageManager";
import EditAppointment from "../../pages/appointment/EditAppointment";
import EditService from "../../pages/Service_and_packages/EditService";

import EditFeedback from "../../pages/feedback/EditFeedback";

import EditPackage from "../../pages/Service_and_packages/EditPackage";
import UserManagement from "./UserManagement";

const contentVariants = {
  open: { marginLeft: 250, transition: { type: "spring", stiffness: 50 } },
  closed: { marginLeft: 0, transition: { type: "spring", stiffness: 50 } },
};

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative min-h-screen bg-PrimaryColor">
      {/* Toggle Button */}

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <motion.main
        className=" flex-1 ml-0 transition-all"
        variants={contentVariants}
        animate={isOpen ? "open" : "closed"}
      >
        <Header />

        {/* Routes for Dashboard Components */}
        <Routes>
          <Route path="/" element={<UserManagement />} />
          {/* <Route path="/create" element={<CreateInventory />} /> */}
          <Route path="/user-management" element={<UserManagement />} />
          <Route
            path="/inventory-management"
            element={<InventoryManagement />}
          />
          <Route path="/Feedback-management" element={<FeedbackManager />} />
          <Route
            path="/appointment-management"
            element={<AppointmentManager />}
          />
          <Route
            path="/Service-management"
            element={<Service_and_PackageManager />}
          />
          <Route path="/edit-appointment/:id" element={<EditAppointment />} />
          <Route path="/edit-feedback/:id" element={<EditFeedback />} />

          <Route path="/edit-inventory/:id" element={<EditInventory />} />

          <Route path="/edit-service/:id" element={<EditService />} />

          <Route path="/edit-package/:packageId" element={<EditPackage />} />
        </Routes>
      </motion.main>
    </div>
  );
}
