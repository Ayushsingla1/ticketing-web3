import { useContext, useEffect, useState } from "react";
import { ABI, Address } from "../contract";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { db , auth } from "../firebase";
import { PinataSDK } from "pinata-web3";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";


// const newContractAddress = "0xAf8D65Ba9f108496dFAD99F007d74d699F750c64";

function Temp({ event, tickets, userName, accountAddress }) {
  const [signerContract, setSignerContract] = useState(null);
  const {ipfsArray, setIpfsArray} = useContext(AppContext)
  const navigate = useNavigate();
  const IpfsUrlArray = [];
  // const [isMining, setIsMining] = useState(false);
  const provider = new ethers.BrowserProvider(window.ethereum)
  const contractABI = ABI;
  const contractAddress = Address;
  const contract = new ethers.Contract(contractAddress, contractABI, provider)
  const pinataJwt = import.meta.env.VITE_REACT_PINATA_JWT_SECRET;
  const {writeContract, data: hash} = useWriteContract()
  const {isLoading, isSuccess, isError} = useWaitForTransactionReceipt({
    hash
  })
  const pinata = new PinataSDK({
    pinataJwt: pinataJwt,
    pinataGateway: `${import.meta.env.VITE_REACT_PINATA_GATEWAY}`,
  });

  
  const deployToIpfs = async() => {
    
    console.log(contract)
    setIpfsArray([])

    for(let i=0; i<tickets; i++){
      const metadata = {
        eventName: event["EventName"],
        eventDescription: event["Description"],
        eventDate: event["Date"],
        eventArtist: event["Artist"],
        eventVenue: event["Venue"],
        owner: userName,
        ticketNumber: event["TotalTickets"],
        NFTimage:  event["NFTimg"]
      }
      try {
        
        event.TotalTickets--; 
        console.log(metadata)
        const metadataIpfsHash = await uploadMetadataToIPFS(metadata);
        console.log('Metadata uploaded to IPFS ticket ',i," :", `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`);
        IpfsUrlArray.push(`https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`)
        
      } catch (error) {
        console.log(`error while uploading to IPFS ${error}`);
        throw error;
      }
      IpfsUrlArray.length !== 0 ? setIpfsArray(IpfsUrlArray) : setIpfsArray("no Ipfs Url")

    }

  }

  const uploadMetadataToIPFS = async (metadata) => {
    const url = import.meta.env.VITE_PINATA_URL;

    try {
      const response = await pinata.upload.json({
        eventName: metadata["eventName"],
        eventDescription: metadata["eventDescription"],
        eventDate: metadata["eventDate"],
        eventArtist: metadata["eventArtist"],
        eventVenue: metadata["eventVenue"],
        owner: metadata["owner"],
        ticketNumber: metadata["ticketNumber"],
        NFTimage:  metadata["NFTimage"]
      })

      return response.IpfsHash;


    } catch (error) {
      console.error('Error uploading metadata to IPFS: ', error.message);
      throw error;
    }
  };

  const buyTicket = async (eventId, price, array) => {

    try {
      const tx = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "buyTickets",
        args: [eventId - 1, tickets, array],
      });
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  async function updateUserNftAndRewardToken(successfullTransaction) {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (!user) {
        console.error('No user is currently logged in');
        navigate('/login');
        return;
      }
  
      const userId = user.uid;
      console.log(userId);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      console.log(userDoc);
      
      if (!userDoc.exists()) {
        console.error('No such user document!');
        return;
      }
  
      const currentNftArray = userDoc.data().nft || [];
      const currentRewardTokens = userDoc.data().rewardTokens || 0;
  
      let updatedNftArray = [...currentNftArray]; 
  
      for (let i = 0; i < IpfsUrlArray.length; i++) {
        const newNftData = {
          ipfsUrl: IpfsUrlArray[i],
          eventId: event.id,
          address: accountAddress
        };
        console.log(newNftData);
        console.log(event.Price);

        updatedNftArray.push(newNftData);
      }

      await updateDoc(userDocRef, {
        nft: updatedNftArray,
        rewardTokens: currentRewardTokens + IpfsUrlArray.length * event.Price * 1000, 
      });
  
      console.log('User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
    } finally {
      navigateToPaymentPage(successfullTransaction);
    }
  }
  
  const buyTicketHandeler = async(eventId, price) => {
    if(!accountAddress){
      alert('no wallet detected, connect to a wallet using the Connect Wallet button');
      return
    }
    await deployToIpfs()

    const successfullTransaction = await buyTicket(eventId, price, IpfsUrlArray);

  }

  if(isSuccess){
    navigate(`/Payment/${event.id}${1}`)
    return
  }

  if(isError){
    navigate(`/Payment/${event.id}${0}`)
    return
  }

  return (
    <button
      className="py-1 px-4 rounded-lg bg-green-500 text-[24px] text-black font-semibold justify-self-end"
      disabled={isLoading}
      onClick={() => buyTicketHandeler(event.id, event.Price * tickets)}
    >
      {isLoading ? "Transaction in process..." : "Buy Tickets"}
    </button>
  );
}

export default Temp;
