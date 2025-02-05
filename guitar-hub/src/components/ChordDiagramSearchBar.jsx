import React, { useState, useEffect } from "react";

const ChordDiagramSearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search for a chord (e.g., 'C')"
      value={value}
      onChange={onChange}
      className="search-bar"
    />
  );
};

export default ChordDiagramSearchBar;
