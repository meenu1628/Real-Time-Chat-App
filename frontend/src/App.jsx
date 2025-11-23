import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from "./layout/landingLayout";
import Home from "./pages/home";
import Contact from "./pages/contact";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import OTPVerification from "./pages/otp-verification";
import Loader from "./components/loader";
import Chat from "./pages/chat";
import "./index.css";
import "./App.css";
import { ChatProvider } from "./components/chatProvider";
import useAuthStatus from "./hooks/useAuthStatus"
import { OtpInput } from "./components/test";


function App() {
  const {loading, isAuthenticated} = useAuthStatus();
  
  if (loading) return <Loader />;
  return isAuthenticated ? (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/:roomId" element={<Chat />} />
      </Routes>
    </ChatProvider>
  ) : (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/loader" element={<OtpInput />} />
        <Route path="verify-otp" element={<OTPVerification />} />
      </Route>
    </Routes>
  );
}

export default App;
