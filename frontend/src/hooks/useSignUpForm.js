import { useState } from "react";

export default function useSignUpForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return { formData, handleChange };
}
