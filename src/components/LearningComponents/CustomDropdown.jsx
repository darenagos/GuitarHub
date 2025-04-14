import React, { useState } from "react";

const CustomDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "want_to_learn":
        return "text-[#A7C85F] hover:scale-105"; // Green for "Want to Learn"
      case "learning":
        return "text-[#1abc9c] hover:scale-105"; // Blue for "Currently Learning"
      case "mastered":
        return "text-yellow-500 hover:scale-105"; // Yellow for "Learnt"
      default:
        return "text-gray-500 hover:scale-105"; // Default gray
    }
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        className="w-full px-4 py-3 border-b-2 border-gray-100 text-gray-700 flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue
          ? selectedValue.replace(/_/g, " ").toUpperCase()
          : "Select an option"}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute left-0 w-full mt-2 bg-white  border-gray-400 rounded-md shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer transition-all ease-in-out ${getStatusColor(
                option.value
              )}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
