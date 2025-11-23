import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "./ui/button"

export default function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const appName= import.meta.env.VITE_APP_NAME
  const isActive = (path) => {
    return location.pathname === path ? "text-black font-semibold" : "text-gray-700 hover:text-black"
  }
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  const closeMobileMenu =()=>{
    setIsMobileMenuOpen(false)
  }

  return (
    <>
    <nav className="flex items-center justify-between px-6 py-6 bg-gray-50 relative z-10">
      <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">{appName[0]}</span>
        </div>
        <span className="text-xl font-bold text-black">{appName}</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link to="/contact" className={`transition-colors ${isActive("/contact")}`}>
          Contact us
        </Link>
        <Link to="/login" className={`transition-colors ${isActive("/login")}`}>
          Login
        </Link>
        <Link to="/signup">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">SIGN UP</Button>
        </Link>
      </nav>

      {/* Mobile menu button - you can expand this later */}
     <div className="md:hidden">
          <Button
            onClick={toggleMobileMenu}
            className="bg-transparent text-black hover:bg-gray-100 p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
    </nav>
    {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeMobileMenu} />

          {/* Mobile menu */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
                <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{appName[0]}</span>
                  </div>
                  <span className="text-xl font-bold text-black">{appName}</span>
                </Link>
                <Button
                  onClick={closeMobileMenu}
                  className="bg-transparent text-black hover:bg-gray-100 p-2"
                  aria-label="Close mobile menu"
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Mobile menu items */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-6">
        
                  <Link
                    to="/contact"
                    className={`block text-lg transition-colors ${isActive("/contact")}`}
                    onClick={closeMobileMenu}
                  >
                    Contact us
                  </Link>

                  <Link
                    to="/login"
                    className={`block text-lg transition-colors ${isActive("/login")}`}
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </div>

                {/* Mobile CTA buttons */}
                <div className="mt-8 space-y-4">
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-3 text-lg">
                      SIGN UP
                    </Button>
                  </Link>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full py-3 text-lg">
                      LOGIN
                    </Button>
                  </Link>
                </div>
              </nav>

              {/* Mobile menu footer */}
              <div className="px-6 py-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">Stay connected, anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
