import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import API_URL from "../../config/config";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  // FIXED: Removed /register from API_BASE and fixed fallback URL
  // Also handles trailing slashes from environment variables
  const API_BASE = `${API_URL}/api/auth`;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Must be at least 6 characters and contain lowercase, uppercase, and number
    const hasMinLength = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasMinLength && hasLowercase && hasUppercase && hasNumber;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const isFormValid = validateName(name) && validateEmail(email) && validatePassword(password);

  const nameError = touched.name && name && !validateName(name);
  const emailError = touched.email && email && !validateEmail(email);
  const passwordError = touched.password && password && !validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ name: true, email: true, password: true });

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateName(name)) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters with uppercase, lowercase, and a number");
      return;
    }

    setLoading(true);
    try {
      // FIXED: Now correctly calls /api/auth/register
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : { message: await response.text() };

      // Log the full response for debugging
      console.log("Full response data:", data); // Debug log

      if (!response.ok) {
        // Handle validation errors
        if (data?.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(e => e.msg).join(", "));
        }
        throw new Error(data?.message || data?.error || "Signup failed");
      }

      // Store token and user data - handle both response formats
      const userData = data.data?.user || data.user;
      const token = data.data?.token || data.token;

      console.log("User data:", userData); // Debug log
      console.log("Token:", token); // Debug log

      if (!userData || !token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("user_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Also store in 'auth' format for Navbar compatibility
      localStorage.setItem("auth", JSON.stringify({
        token: token,
        ...userData
      }));
      
      console.log("Stored auth:", localStorage.getItem("auth")); // Debug log
      
      // Trigger auth change event for Navbar
      window.dispatchEvent(new Event("authChange"));
      
      // Small delay to ensure localStorage is written
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite'}}></div>
        <div className="absolute top-40 right-10 w-40 sm:w-72 h-40 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite', animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-40 sm:w-72 h-40 sm:h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite', animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Section - Form */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Sign up</h2>
              <p className="text-sm sm:text-base text-gray-500">Create your GreenFeather account</p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    placeholder="Enter your full name"
                    className={`w-full p-2.5 sm:p-3 pl-10 sm:pl-11 pr-4 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-xs sm:text-sm ${
                      nameError
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : name && validateName(name)
                        ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    autoComplete="name"
                  />
                  {name && validateName(name) && !nameError && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  )}
                </div>
                {nameError && (
                  <p className="mt-1 text-red-600 text-xs sm:text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Name must be at least 2 characters
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="you@example.com"
                    className={`w-full p-2.5 sm:p-3 pl-10 sm:pl-11 pr-4 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-xs sm:text-sm ${
                      emailError
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : email && validateEmail(email)
                        ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    autoComplete="email"
                  />
                  {email && validateEmail(email) && !emailError && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  )}
                </div>
                {emailError && (
                  <p className="mt-1 text-red-600 text-xs sm:text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Please enter a valid email
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 sm:mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    placeholder="Create a password"
                    className={`w-full p-2.5 sm:p-3 pl-10 sm:pl-11 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-xs sm:text-sm ${
                      passwordError
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : password && validatePassword(password)
                        ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-red-600 text-xs sm:text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Password must be 6+ characters with uppercase, lowercase, and number
                  </p>
                )}
                {password && !passwordError && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <span>Password strength:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${
                          password.length >= 12 ? "w-full bg-green-500" :
                          password.length >= 8 ? "w-2/3 bg-yellow-500" : "w-1/3 bg-red-500"
                        }`}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                  isFormValid && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Sign Up</span>
                  </>
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6 sm:mt-8">
              <p className="text-gray-500 text-xs sm:text-sm mb-3 text-center">Or sign up using</p>
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                  Google
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                  Facebook
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                  Twitter
                </button>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm text-center">
                Already have an account?{" "}
                <Link
                  to="/user/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Section - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GreenFeather</h1>
              <p className="text-gray-600 mb-8">Shop Smart, Live Green</p>
              
              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.LjPV7bXPkIaPcgYFwtATfwHaEK?pid=Api&P=0&h=220"
                  alt="Register illustration"
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Quick & Secure Sign-up</h3>
                <p className="text-gray-600 text-sm">
                  Join GreenFeather and get secure access. Experience fast registration and one-tap login.
                </p>
              </div>
              
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-sm">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default Register;