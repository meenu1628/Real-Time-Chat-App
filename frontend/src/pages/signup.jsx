import { Link, useNavigate } from "react-router-dom";
import useSignUpForm from "../hooks/useSignUpForm";
import { handleSubmit } from "../handlers/signUpHandlers";
import { ErrorAlert } from "../components/errorAlert";
import Loader from "../components/loader";
import { useState } from "react";

export default function SignUp() {
  const appName = import.meta.env.VITE_APP_NAME;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { formData, handleChange } = useSignUpForm();
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

  return (<>
    {loading && <Loader/>}
    <div className="min-h-screen bg-[#D8EDC2] flex items-center justify-center py-16">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Get Started</h1>
            <p className="text-gray-600">Create your {appName} account</p>
          </div>
          <form onSubmit={async (e) => await handleSubmit(e,formData, navigate,setError,setLoading)} className="space-y-6">
            {error && <ErrorAlert message={error} />}
            {renderInput("Full Name", "fullname")}
            {renderInput("User Name", "username")}
            {renderInput("Email", "email", "email")}
            {renderInput("Password", "password", "password")}
            {renderInput("Confirm Password", "confirmPassword", "password")}
       
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-black font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
