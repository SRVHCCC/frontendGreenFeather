const isProduction = import.meta.env.MODE === "production";

const config = {
  API_URL: isProduction
    ? "https://yourdomain.com/api"
    : "http://localhost:5000/api",

  APP_NAME: "MERN E-commerce Store",
  TIMEOUT: 15000,
};

export default config;