import React, { useState } from "react";

const CustomDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        className="w-full px-4 py-3 border-b-2 border-gray-500 text-gray-700 flex justify-between items-center focus:outline-none"
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
              className="px-4 py-2 hover:bg-[#e3d8b7] cursor-pointer transition-all ease-in-out"
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
