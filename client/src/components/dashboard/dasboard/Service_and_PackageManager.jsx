import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Createpackage from "../../../pages/Service_and_packages/Createpackage";
import CreateService from "../../../pages/Service_and_packages/CreateService";
import ManageService from "../../../pages/Service_and_packages/ManageService";
import ManagePackage from "../../../pages/Service_and_packages/ManagePackage";

export default function Service_and_PackageManager() {
  const [activeTab, setActiveTab] = useState("manageService"); // State to manage active tab

  return (
    <motion.div
      className="p-10 pl-16 pr-1 min-h-screen bg-PrimaryColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-2 text-ExtraDarkColor">
        Service And Package Management
      </h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b-2 mb-4 border-SecondaryColor">
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "manageService"
              ? "border-b-4 border-DarkColor text-DarkColor"
              : "text-ExtraDarkColor"
          }`}
          onClick={() => setActiveTab("manageService")}
        >
          Manage Service
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "addService"
              ? "border-b-4 border-DarkColor text-DarkColor"
              : "text-ExtraDarkColor"
          }`}
          onClick={() => setActiveTab("addService")}
        >
          Add Services
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "managePackage"
              ? "border-b-4 border-DarkColor text-DarkColor"
              : "text-ExtraDarkColor"
          }`}
          onClick={() => setActiveTab("managePackage")}
        >
          Manage Packages
        </div>
        <div
          className={`cursor-pointer px-4 py-2 -mb-1 ${
            activeTab === "addPackage"
              ? "border-b-4 border-DarkColor text-DarkColor"
              : "text-ExtraDarkColor"
          }`}
          onClick={() => setActiveTab("addPackage")}
        >
          Add Packages
        </div>
      </div>

      {/* Render Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {activeTab === "manageService" && <ManageService />}
          {activeTab === "addService" && <CreateService />}
          {activeTab === "managePackage" && <ManagePackage />}
          {activeTab === "addPackage" && <Createpackage />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}