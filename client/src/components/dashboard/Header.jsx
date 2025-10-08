// Header.js
import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-PrimaryColor pt-4 flex justify-between items-center">
      <div className="flex items-center"></div>
      <div className="flex items-center">
        <FaSearch className="text-DarkColor mr-3" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
        />
        <FaBell className="text-DarkColor mr-4 cursor-pointer" />
      </div>
    </header>
  );
}
