"use client";

import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Adjust path if needed

export function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    const newOtp = [...otp];

    for (let i = 0; i < length; i++) {
      newOtp[i] = pasted[i] || "";
    }

    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, length) - 1;
    inputsRef.current[nextIndex]?.focus();

    if (newOtp.every((d) => d !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex gap-2">
      {otp.map((digit, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center text-xl font-mono tracking-wider"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </div>
  );
}
