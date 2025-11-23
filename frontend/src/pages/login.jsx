import {  useState } from "react"
import { Link, replace, useNavigate } from "react-router-dom"
import Loader from "../components/loader";
import { apiRequest} from "../lib/utils";
import useChatStore from "../stores/chatStore";
import {ErrorAlert} from "../components/errorAlert";
export default function Login() {
    const appName= import.meta.env.VITE_APP_NAME;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
      usernameOrEmail: "",
      password: "",
    })
  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  const renderInput = (label, name, type = "text") => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        required
      />
    </div>
  );

  const handleSubmit = async(e) => {
    e.preventDefault()
    // Handle login
    setLoading(true);
  
    const {error,data}= await apiRequest({
      url: "/api/auth/login",
      method: "POST",
      body: {...formData, usernameOrEmail: formData.usernameOrEmail.trim()},
    });
    setLoading(false);
    if(error){
       setError(error);
       return ;
    }
    else {
      const {user} = data;
      setCurrentUser(user);
      navigate("/",{replace:true});
      window.location.reload();
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (<>
  {loading&& <Loader/>}
    <div className="min-h-screen bg-[#D8EDC2] flex items-center justify-center py-16">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your {appName} account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorAlert message={error} onClear={setError} />}
            {renderInput("UserName Or Email", "usernameOrEmail", "text")}
            {renderInput("Password", "password", "password")}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-black font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
