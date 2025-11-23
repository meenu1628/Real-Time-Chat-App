import { Outlet } from "react-router-dom"
import Header from "../components/header"
import Footer from "../components/footer"

export default function LandingLayout() {
  return (
    <div className="min-h-screen">
      <Header/>
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}
