import { useState, useEffect } from "react";

export default function useOtpTimer(initial = 30) {
  const [resendTimer, setResendTimer] = useState(initial);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const resetTimer = () => {
    setResendTimer(initial);
    setCanResend(false);
  };
  
  return { resendTimer, canResend, resetTimer };
}
