import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import RewardCoins from "./RewardCoins";
import { doc , getDoc} from "firebase/firestore";
import { db } from "../firebase";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rewardToken, setRewardToken] = useState(0);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     console.log(user);
  
  //     if (user) {
  //       setIsLoggedIn(true);
  //     } else {
  //       console.log("no user found")
  //       setIsLoggedIn(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const rewardTokens = userDoc.data().rewardTokens || 0;
          setRewardToken(rewardTokens);
          console.log("Reward Tokens:", rewardToken);
        } else {
          console.log("No user document found!");
        }
      } else {
        console.log("No user found");
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe(); 
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-between py-3">
      <div className="uppercase font-jaini text-5xl">
        Ticketing
      </div>
      <div>
        {!isLoggedIn ? (
          <div>
            <button className="px-4 py-2"
              onClick={() => {
                navigate("/signup");
              }}
            >
              SignUp
            </button>
            <button className="px-4 py-2 border-2 border-zinc-600 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out" 
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <RewardCoins coins = {rewardToken}/> 
        )}
      </div>
    </div>
  );
};

export default NavBar;
