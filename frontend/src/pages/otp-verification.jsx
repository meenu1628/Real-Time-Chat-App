import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useOtpTimer from "../hooks/useOtpTimer";
import { OtpInput } from "../components/test";
import Loader from "../components/loader";
import { ErrorAlert } from "../components/errorAlert";
import { apiRequest } from "../lib/utils";
export default function OTPVerification() {
  const appName = import.meta.env.VITE_APP_NAME;
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resendTimer, canResend, resetTimer } = useOtpTimer(30);

  const onComplete = async (otp) => {
    setLoading(true);
    const { data, error } = await apiRequest({
      url: "/api/auth/verifyemail",
      method: "POST",
      body: { email, otp },
    });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    navigate("/login");
  };

  const handleResend = async () => {
    if (!canResend) return;
    resetTimer();
    setError("");
    try {
      // to implement
      // Resend OTP logic here
      await new Promise((res) => setTimeout(res, 1000));
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      {error && <ErrorAlert message={error} onClear={() => setError("")} />}
      <div className="min-h-screen bg-[#D8EDC2] flex items-center justify-center p-4">
        <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {appName[0]}
                  </span>
                </div>
                <span className="text-2xl font-bold text-black">{appName}</span>
              </div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Welcome {name}
              </h1>
              <h1 className="text-3xl font-bold text-black mb-2">
                Verify Your Account
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit verification code to
                <br />
                <span className="font-semibold text-black">your {email}</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-center gap-3 mb-4">
                <OtpInput onComplete={onComplete} />
              </div>
              {error && (
                <div className="text-center text-red-500 text-sm mb-4 animate-pulse">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-black font-medium hover:underline transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500 text-sm">
                  Resend in {resendTimer}s
                </span>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-gray-600 hover:text-black transition-colors text-sm"
              >
                ← Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
