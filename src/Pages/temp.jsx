import { useContext, useEffect, useState } from "react";
// import { EventTicketNFTABI } from "../../data";
// import { neoXNFTAbi } from "../../data";
// import Web3 from "web3";
import axios from "axios";
// import { ethers } from "ethers";
import { ABI, Address } from "../contract";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { db , auth } from "../firebase";
import { PinataSDK } from "pinata-web3";

const newContractAddress = "0xAf8D65Ba9f108496dFAD99F007d74d699F750c64";

function Temp({ event, tickets, userName, accountAddress }) {
  const [signerContract, setSignerContract] = useState(null);
  const {ipfsArray, setIpfsArray} = useContext(AppContext)
  const navigate = useNavigate();
  const IpfsUrlArray = [];
  const [isMining, setIsMining] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum)

  const contractABI = ABI;
  const contractAddress = Address;

  const contract = new ethers.Contract(contractAddress, contractABI, provider)

  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataApiSecret = import.meta.env.VITE_PINATA_SECRET;

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_REACT_PINATA_JWT_SECRET,
    pinataGateway: "example-gateway.mypinata.cloud",
  })


  useEffect(() => {
    const getContractSigner = async () => {

        try {
 

          await provider.send('eth_requestAccounts', []);

          const signer = await provider.getSigner();

          const contractWithSigner = contract.connect(signer);
          setSignerContract(contractWithSigner);

          console.log(signer)


        } catch (error) {
          console.error("User denied account access or other error:", error);
        }
    };

    getContractSigner();
  }, []);


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
    try {
      const upload = await pinata.upload.json(metadata)
      console.log(upload)
      return upload.IpfsHash;


    } catch (error) {
      console.error('Error uploading metadata to IPFS: ', error.message);
      throw error;
    }
  };

  const buyTicket = async (eventId, price, array) => {

    try {
    
    const tx = await signerContract.buyTickets(eventId, tickets, array,{
      value: ethers.parseEther(price.toString()), // Convert ether to Wei
    });

    console.log("Transaction sent:", tx);

    // Wait for the transaction to be mined
    setIsMining(true);
    const receipt = await tx.wait();
    setIsMining(false);

    console.log("Transaction mined:", receipt);

      console.log("Ticket purchased:", tx);

      if(tx){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  const navigateToPaymentPage = (successfullTransaction) => {
    if(successfullTransaction){
      navigate(`/Payment/${event.id}${1}`)
    }else{
      navigate(`/Payment/${event.id}${0}`)
    }
  }

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
    // const successfullTransaction = true;
    if(successfullTransaction){
      console.log(IpfsUrlArray)
      return updateUserNftAndRewardToken(successfullTransaction);
    }
    else{
      return navigateToPaymentPage(successfullTransaction)
    }
  }

  return (
    <button
      className="py-1 px-4 rounded-lg bg-green-500 text-[24px] text-black font-semibold justify-self-end"
      onClick={() => buyTicketHandeler(event.id, event.Price * tickets)}
    >
      Buy Ticket
    </button>
  );
}

export default Temp;
