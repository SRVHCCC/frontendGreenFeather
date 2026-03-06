import React from "react";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
      </div>
    </div>
  );
};

export default SectionHeader;
