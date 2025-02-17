import { useState } from "react";
import SimpleSlider from "../Components/SignSlider";
import { NavLink , useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword , GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { auth , db} from "../firebase";
import { doc, setDoc , getDoc} from "firebase/firestore";

import toast from "react-hot-toast";
const SignUp=()=>{
    const navigate = useNavigate();
    const [data,setdata] = useState({name : "" , contact : "", email : "" , password : ""});
    const changeHandler = (e)=>{
        const {name,value} = e.target
        setdata((prev)=>({
            ...prev,
            [name] : value,
        }))
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("hello insdie")
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            console.log("User:", user);
            try {
                const res = await setDoc(doc(db, "users", user.uid), {
                    name: data.name,
                    contact: data.contact,
                    email: data.email,
                    rewardTokens: 0,
                    nft: [],
                });
                console.log(res)
                toast.success('SignUp Successful');
                navigate('/');
            } catch (firestoreError) {
                console.error("Error saving user data to Firestore:", firestoreError);
                toast.error("Failed to save user data to Firestore.");
            }
        } catch (error) {
            console.error("Error during sign up:", error.message);
            toast.error("SignUp Unsuccessful");
        }
        setdata({ name: "", contact: "", email: "", password: "" });
    };
    
    const handleSignup = async () => {
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
                toast.success("Sign in successfully!");
            }
            navigate('/');
        } catch (error) {
            console.error("Error during Google SignUp:", error);
        }
    };
    return(
        <div className="overflow-hidden bg-Siuu w-screen h-screen flex justify-center items-center">
            <div className="w-1/2 my-auto h-screen">
            <SimpleSlider/>
            </div>
            <div className="w-1/2">
            <div className="flex flex-col items-center">
                <div className="text-3xl font-bold font-poppins">Create Your Account</div>
                <form className="w-64 flex flex-col gap-y-4 mt-10">
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-xl">Name</label>
                    <input type ='text' name = "name" value = {data.name} onChange={changeHandler} id="name" className="h-9 border-2 rounded-lg p-2"></input>
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor="email" className="text-xl">Email</label>
                    <input type ='email' name = "email" value = {data.email} onChange={changeHandler} id="email" className="h-9 border-2 rounded-lg p-2"></input>
                    </div>
                    <div className="flex flex-col">
                    <label htmlFor="contact" className="text-xl">Contact No.</label>
                    <input type ='text' name = "contact" value = {data.contact} onChange={changeHandler} id="contact" className="h-9 border-2 rounded-lg p-2"></input>
                    </div>
                    <div className="flex flex-col">
                            <label htmlFor="password" className="text-xl">Password</label>
                            <input type="password" name="password" value={data.password} onChange={changeHandler} id="password" required className="h-9 border-2 rounded-lg p-2"/>
                    </div>
                    <div className="flex justify-center items-center h-12 bg-[#0E64D2] rounded-md cursor-pointer"> 
                    <button onClick={(e)=> {submitHandler(e)}} className="text-xl">Create Account</button>
                    </div>
                </form>
                <div className="mt-4 font-poppins">Already have an account? <NavLink to='/login' className="text-blue-600">Login</NavLink></div>
                <div className="flex justify-between items-center border-black border-2 border-opacity-60 py-1 px-3 rounded-md mt-4 gap-x-3 w-64 cursor-pointer font-poppins" onClick={()=>{handleSignup()}} >
                    <FcGoogle className="h-8 w-8"/>
                    <div><button>SignUp with Google</button></div>
                    <div>
                    </div>
                    </div>
            </div>
            </div>
        </div>
    )
}

export default SignUp;