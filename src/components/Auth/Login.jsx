import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config/config";
import { Shield, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

const UserLogin = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateIdentifier = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile format
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched(true);

    if (!identifier.trim()) {
      setError("Email or mobile number is required");
      return;
    }

    if (!validateIdentifier(identifier.trim())) {
      setError("Enter valid email or 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: identifier.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/otp-login", {
          state: { identifier: identifier.trim() },
        });
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const identifierError = touched && identifier && !validateIdentifier(identifier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite'}}></div>
        <div className="absolute top-40 right-10 w-40 sm:w-72 h-40 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite', animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-40 sm:w-72 h-40 sm:h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{animation: 'blob 7s infinite', animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
              <p className="text-gray-500">to your GreenFeather account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email or Mobile Number
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter email or mobile number"
                    className={`w-full p-3 pl-11 border-2 rounded-xl focus:outline-none transition-all text-sm ${
                      identifierError
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : identifier && validateIdentifier(identifier)
                        ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                  />

                  {identifier && validateIdentifier(identifier) && !identifierError && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>

                {identifierError && (
                  <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Enter valid email or 10-digit mobile number
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!validateIdentifier(identifier) || loading}
                className={`w-full p-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                  validateIdentifier(identifier) && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Continue</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign up now
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GreenFeather</h1>
              <p className="text-gray-600 mb-8">Shop Smart, Live Green</p>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.ziqmW9JBoD9NSSqj5M2juAHaFV?pid=Api&P=0&h=220"
                  alt="Secure Login"
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Fast & Secure</h3>
                <p className="text-gray-600 text-sm">
                  Passwordless login using secure OTP verification.
                </p>
              </div>
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

export default UserLogin;