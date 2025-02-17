import BillingEventCard from "../Components/BillingEventCard";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import sciCut from '../assets/Group 20.svg'
import 'flowbite';
import { AppContext } from "../Context/AppContext";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const payment2 = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const {ipfsArray, setIpfsArray} = useContext(AppContext);
    const [user1, setUser1] = useState(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'EventsInfo'); 
                const querySnapshot = await getDocs(eventsCollection);
                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                const eventIndex = parseInt(id[0]) - 1;
                if (eventIndex >= 0 && eventIndex < eventsData.length) {
                    setItem(eventsData[eventIndex]);
                } else {
                    console.error('Event ID is out of bounds');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false); 
            }
        };

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log(user);
          console.log(user.photoURL)
          setUser1(user);
          if (user) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        });
        fetchEvents();
        return () => unsubscribe();
    }, [id]); 

    if(parseInt(id.toString()[1]) === 0){
        setIpfsArray([])
    }

    const goHome = () => {
        navigate('/')
    }

    if (loading) {
        return (
            <div className="flex w-screen h-screen justify-center items-center bg-black">
            <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                    </svg>
                </div>
                <div className="w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                </div>
                <span className="sr-only">Loading...</span>
            </div> 
            </div>
        );

    } 

    return ( <div className="w-screen h-screen overflow-hidden bg-[#1F1F1F] text-white relative">
        <img className="absolute w-full h-[55%] opacity-35 blur-xl aspect-2/3" src={item["Image"]}/>
        <img className="absolute w-[120px] h-[120px] rounded-full blur-sm translate-x-[-40%] bottom-[24%]" src={item['NFTimg']}/>
        <img className="absolute w-[120px] h-[120px] rounded-full blur-sm translate-x-[-40%] bottom-[24%]" src={item['NFTimg']}/>
        <div className="flex flex-col justify-center absolute z-[1] bg-none items-center w-full">
            {/* nav */}
            <div className="w-11/12 flex items-center pt-3 justify-between">
                <span className="text-[45px] font-jaini" onClick={goHome}>Ticketing</span>
                <div className="flex gap-x-2">
                    {/* <button className="px-4 py-2 bg-white text-[#1F1F1F] text-[24px] max-h-[50px] border border-black rounded-md" onClick={connectWallet}>{account ? (<div>{account.slice(0, 4) + '...' + account.slice(-4)}</div>) : (<div>Connect Wallet</div>)}</button> */}
                    {user1 ? (<img src={user1.photoURL} className="w-[50px] h-[50px] rounded-full" />) : (<div className="bg-purple-600 w-[50px] h-[50px] rounded-full"></div>)}
                </div>
            </div>

            {parseInt(id.toString()[1]) === 0? (<div className="text-5xl text-[#cc0000] text-center font-semibold">Payment UnSuccess!!</div>) 
                : (<div className="text-5xl text-[#00CC30] text-center font-semibold">Payment Success!!</div>)}

            {/* img  */}
            <div className="justify-center font-ptMono w-full flex items-center">
                <div className="relative flex h-1/2 gap-x-20 w-10/12 bg-slate-600 bg-opacity-70 px-10 py-4 rounded-md m-5 z-10">
                    <div className="w-4/6 text-white flex flex-col justify-evenly gap-x-10">
                        <div className="text-2xl font-bold">{item.EventName}</div>
                        <div className="text-justify font-semibold">{item.Description}</div>
                        <div className="font-semibold text-[20px]">Artist : {item.Artist}</div>
                        <div className="font-semibold text-[20px]">Price: {item.Price}</div>
                    </div>
                    <div className="w-2/6 h-full flex justify-center">
                        <img src={item.Image} className="object-fill h-[24rem]" />
                    </div>
                    <div className="absolute font-stickNoBills font-semibold w-full text-center text-[66px] left-[50%] translate-x-[-50%] translate-y-[50%] bottom-[0px]">{item.EventName}</div>
                </div>
            </div>

            {/* details */}
            <div className="flex font-ptMono gap-x-[80px] h-full">
                <div className="flex px-2 flex-col justify-center items-center gap-y-3">
                    <span className="text-[52px] font-portLigatSlab text-[#E9FF42]">Event Details</span>
                    <div className="flex text-[27px] justify-center items-center flex-col">
                            <span className="flex justify-center items-center gap-x-2"><span>Venue</span> <span className="text-yellow-400">:</span> <span className="font-rockSalt text-red-500">{item.Venue}</span></span>
                            
                            <span className="flex justify-center items-center gap-x-2"><span>Date</span> <span className="text-yellow-400">:</span> <span className="font-rockSalt text-red-500">{item.Date}</span></span>

                            <span className="flex justify-center items-center gap-x-2"><span>Artist</span> <span className="text-yellow-400">:</span> <span className="font-rockSalt text-red-500">{item.Artist}</span></span>

                            <span className="flex justify-center items-center gap-x-2"><span>Ticket Price</span> <span className="text-yellow-400">:</span> <span className="font-rockSalt text-red-500">{item.Price} GAS</span></span>

                        </div>
                </div>

                <div><img src={sciCut}/></div>

                <div>
                    <div className="flex font-ptMono px-2 flex-col justify-center items-center gap-y-3 h-full">
                        <span className="text-[52px] font-portLigatSlab text-[#E9FF42]">Preview NFT</span>
                        <div className="flex text-[27px] w-full justify-center gap-y-1 items-center flex-col">
                            <img className="w-[120px] h-[120px] rounded-full" src={item.NFTimg}/>
                            {
                                ipfsArray.length !== 0 ? (
                                    <div className="flex flex-col gap-y-4">
                                        {
                                            ipfsArray.map((url, index) => (
                                                <NavLink key={index} to = {url}><button className="bg-green-500 text-black font-semibold text-2xl px-4 py-2 rounded-md">view Nft metadata {index+1}</button></NavLink>
                                            ))
                                        }
                                    </div>
                                ) 
                                : (<>No NFT generated</>)
                            }
                        </div>
                    </div>
                </div>
            </div>


        </div>   
    </div> );
}
 
export default payment2;