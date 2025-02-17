import { useState } from "react";
import SimpleSlider from "../Components/SignSlider";
import { NavLink } from "react-router-dom";
import { signInWithEmailAndPassword , GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc , getDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Login =()=>{
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [data,setdata] = useState({email : "" , password : ""});
    const changeHandler = (e)=>{
        const {name,value} = e.target
        setdata((prev)=>({
            ...prev,
            [name] : value,
        }))
    }
    const submitHandler = async() => {
        e.preventDefault();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
        navigate('/')
        } catch (error) {
        toast.error("Login failed: " + error.message);
    }
    }
const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                profilePicture: user.photoURL,
                rewardTokens: 0,
                nft: [],
            });
            console.log("User details saved to Firestore:", user);
            toast.success("Account created and logged in successfully!");
        } else {
            console.log("User already exists in Firestore:", user);
            toast.success("Logged in successfully!");
        }
        navigate('/');
    } catch (error) {
        console.error("Error during Google login:", error);
    }
};


    return(
        <div className="overflow-hidden bg-Siuu w-screen h-screen flex justify-center items-center">
            <div className="w-1/2 my-auto h-screen">
            <SimpleSlider/>
            </div>
            <div className="w-1/2">
            <div className="flex flex-col items-center">
                <div className="text-3xl font-bold font-poppins">Hi, Welcome Back! 👋</div>
                <form className="w-60 flex flex-col gap-y-10 mt-10">
                    <div className="flex flex-col">
                    <label htmlFor="email" className="text-xl">Email</label>
                    <input type ='email' name = "email" value = {data.email} onChange={changeHandler} id="email" className="h-9 border-2 rounded-lg p-2"></input>
                    </div>
                    <div className="flex flex-col">
                            <label htmlFor="password" className="text-xl">Password</label>
                            <input type="password" name="password" value={data.password} onChange={changeHandler} id="password" required className="h-9 border-2 rounded-lg p-2"/>
                        </div>
                    <div className="flex justify-center items-center h-12 bg-[#0E64D2] rounded-md cursor-pointer"> 
                    <button onClick={submitHandler} className="text-xl">Login</button>
                    </div>
                </form>
                <div className="mt-4">Don't have an account? <NavLink to='/SignUp' className="text-blue-600">SignUp</NavLink></div>
                <div className="flex justify-between items-center border-black border-2 border-opacity-60 py-1 px-3 rounded-md mt-4 gap-x-3 w-64 cursor-pointer" onClick={()=>{handleLogin()}}>
                    <FcGoogle className="h-8 w-8"/>
                    <div><button>LogIn with Google</button></div>
                    <div>
                    </div>
                    </div>
            </div>
            </div>
        </div>
    )
}

export default Login;