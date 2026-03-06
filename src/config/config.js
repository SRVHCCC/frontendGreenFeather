
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://greenfeather.com" 
    : "http://localhost:5000"); 

export default API_URL;
