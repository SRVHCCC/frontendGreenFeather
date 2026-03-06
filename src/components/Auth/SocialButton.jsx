import React from "react";

const SocialButton = ({ icon, bgColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded-md ${bgColor} text-white hover:opacity-80`}
    >
      {icon}
    </button>
  );
};

export default SocialButton;
