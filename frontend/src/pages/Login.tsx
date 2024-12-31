import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store/Store";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../Store/Slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiLock2Fill } from "react-icons/ri";

export const Login = () =>{

    const [email , setEmail] = useState("");

    const [password , setPassword] = useState("");

    const [role , setRole] = useState("");


    const {loading , isAuthenticated , error} = useSelector((state:any)=>state.user);

    const dispatch = useDispatch<AppDispatch>();

    const navigateTo = useNavigate();

    const handleLogin = (e:any)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("role" , role);
        formData.append("email" , email);
        formData.append("password" , password);
        
        dispatch(login(formData))
    }

    useEffect(()=>{
        if(error){
            toast.error(error);
            dispatch(clearAllUserErrors());
        }
        if(isAuthenticated){
            navigateTo("/")
        }
    }, [dispatch , error , loading , isAuthenticated])

    
    return <div>
        <section className="authPage">
        <div className="container login-container">
          <div className="header">
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Login as an Employer</option>
                  <option value="JobSeeker">Login as a Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email</label>
              <div>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              Login
            </button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
      </section>
    </div>
}