import React from "react";

const CustomToggle = ({ checked = true, onChange = () => {} }) => {
  return (
    <>
      <input type="checkbox" id="check" className="toggle" checked={checked} onChange={onChange} />
      <label htmlFor="check"></label>
    </>
  );
};

export default CustomToggle;
