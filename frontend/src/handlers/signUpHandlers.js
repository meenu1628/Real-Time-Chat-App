import { apiRequest } from "../lib/utils";
export const handleSubmit = async(e,formData, navigate,setError,setLoading) => {
  e.preventDefault();
  setLoading(true);
  if(!formData) {
    console.error("Form data is not provided");
    return;
  }
  const formError = validateForm(formData);
  if (formError) {
    setError(formError);
    setLoading(false);
    return;
  }
  
  
 const {data,error} = await apiRequest({
    url: "/api/auth/signup",
    method: "POST",
    body: {...formData, username: formData.username.trim(),fullname: formData.fullname.trim(),email: formData.email.trim()},
  });
  setLoading(false);
  if(error){
     setError(error);
     return;
  }
  navigate("/verify-otp", {
    state: {
      email: formData.email,
      name: formData.fullname,
    },
  });
};

const validateForm = (formData) => {
  const { fullname, username, email, password, confirmPassword } = formData;

  if (!fullname.trim() || !username.trim() || !email || !password || !confirmPassword) {
    return "All fields are required."
    
  }
  if (fullname.length < 3) {
    return "Full name must be at least 3 characters long."
    
  }
  if (username.length < 3) {
    return "User name must be at least 3 characters long."
    
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long."
    
  }
  if (password !== confirmPassword) {
    return "Passwords do not match."
     
  }
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return "Username can only contain letters and numbers"
    
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email format"
    
  }
  return ''; // No errors
}


