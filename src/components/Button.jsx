import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  className = "" 
}) => {
  
  const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-300 active:scale-95 cursor-pointer";
  
  const variants = {
    primary: "bg-yellow-900 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;