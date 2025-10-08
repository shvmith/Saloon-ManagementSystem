// UserManagement.js
import React from "react";
import { motion } from "framer-motion";
import AllUsers from "../../pages/users/AllUsers";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];

export default function UserManagement() {
  return (
    <motion.div
      className=" p-10 pl-20 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        User Management
      </h1>
      <AllUsers />
    </motion.div>
  );
}
