
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Jobs } from "./pages/Jobs";
import { Dashboard } from "./pages/Dashboard";
import { PostApplication } from "./pages/PostApplication";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import  NotFound  from "./pages/NotFound";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./Store/Store";
import { useEffect } from "react";
import { getUser } from "./Store/Slices/userSlice";
import Footer from "./Components/Fotter";
import Navbar from "./Components/Navbar";

function App() {
  
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    dispatch(getUser())
  },[])


  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </Router>
    </>
  )
}

export default App
