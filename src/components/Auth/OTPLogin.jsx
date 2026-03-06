import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UnifiedAuthContext";
import { Mail, Phone, Shield, ArrowLeft, Clock, RefreshCw } from "lucide-react";

const OTPLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, verifyOTP, resendOTP, loading } = useAuth();
  const params = new URLSearchParams(location.search);
  const roleFromQuery = params.get('role') || 'user';
  
  const [step, setStep] = useState(1); 
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isEmail, setIsEmail] = useState(false);

  useEffect(() => {
    const prefill = location?.state?.identifier;
    if (prefill) {
      setEmailOrPhone(prefill);
      setIsEmail(validateEmail(prefill));
      setStep(2);
      setTimeLeft(300);
      setCanResend(false);
      setSuccess(`OTP sent to your ${validateEmail(prefill) ? 'email' : 'phone'}`);
    }
  }, [location]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && step === 2) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleEmailOrPhoneChange = (e) => {
    const value = e.target.value;
    setEmailOrPhone(value);
    setError("");
    
    if (validateEmail(value)) {
      setIsEmail(true);
    } else if (validatePhone(value)) {
      setIsEmail(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number");
      return;
    }

    if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
      setError("Please enter a valid email address or 10-digit phone number");
      return;
    }

  const result = await sendOTP(emailOrPhone.trim(), roleFromQuery);
    
    if (result.success) {
      setStep(2);
      setTimeLeft(300); // 5 minutes
      setCanResend(false);
      setSuccess(`OTP sent to your ${isEmail ? 'email' : 'phone'}`);
    } else {
      setError(result.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

  const result = await verifyOTP(emailOrPhone.trim(), otp.trim(), roleFromQuery);
    
    if (result.success) {
      setSuccess("Login successful!");
      const from = location?.state?.from || null;
      const destination = typeof from === "string" ? from : from?.pathname || "/";
      navigate(destination, { replace: true });
    } else {
      setError(result.message || "Invalid OTP");
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setCanResend(false);

  const result = await resendOTP(emailOrPhone.trim(), roleFromQuery);
    
    if (result.success) {
      setTimeLeft(300); 
      setSuccess("OTP resent successfully");
    } else {
      setError(result.message || "Failed to resend OTP");
      setCanResend(true);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccess("");
    setTimeLeft(0);
    setCanResend(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? "Secure Login" : "Verify OTP"}
          </h2>
          <p className="text-gray-600">
            {step === 1 
              ? "Enter your email or phone number to receive OTP" 
              : "Enter the 6-digit code sent to your device"
            }
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email or Phone Number
                </label>
                <div className="relative">
                  {isEmail ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  )}
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={handleEmailOrPhoneChange}
                    placeholder={isEmail ? "you@example.com" : "9876543210"}
                    className="w-full p-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your registered email address or phone number
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !emailOrPhone.trim()}
                className={`w-full font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                  loading || !emailOrPhone.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      setError("");
                    }}
                    placeholder="123456"
                    className="w-full p-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    maxLength={6}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Sent to: {isEmail ? emailOrPhone : emailOrPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3')}
                  </p>
                  {timeLeft > 0 && (
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className={`w-full font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                    loading || otp.length !== 6
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Verify & Login</span>
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                    className={`flex-1 py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      canResend && !loading
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    <span>Resend</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up now
            </Link>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Or{" "}
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-700 underline"
            >
              login with password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
