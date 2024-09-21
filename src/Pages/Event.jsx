import EventElement from "../Components/EventElement";
import { useParams } from 'react-router-dom';
import { useEffect,useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";
const Event = ()=>{
    const [item,setitem] = useState({});
    const { id } = useParams();
    const [loading,setLoading] = useState(true)
    console.log(id)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
              const eventsCollection = collection(db, 'EventsInfo'); // Replace 'EventsInfo' with your actual collection name
              const querySnapshot = await getDocs(eventsCollection);
              const eventsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setitem(eventsData[id-1]);
            } catch (error) {
              console.error('Error fetching events:', error);
            }
          };
          fetchEvents();
          setLoading(false);
        }, []);

        if(loading){
            return (<div className="w-screen h-screen bg-black flex justify-center items-center"><Loader/></div>)
        }
        else{
        return(<div className="bg-black h-screen w-screen">
            <EventElement item = {item}/>
        </div>)
        }
}
export default Event;