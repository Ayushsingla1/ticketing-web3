import Web3 from "web3";
import { ABI, Address, testrpc } from "../contract";


const Web3Comp = () => {

    // const walletAddress = '0x5D8c93Ccf0C1FEB3b93B6b5D3d4eFFe08c2aF3f2'

    // Set up Web3 instance and connect to Ethereum network (you can replace this with a provider, like Infura or Alchemy)
    const web3 = new Web3(testrpc);
    
    // ABI and Contract Address (replace these with your actual contract's ABI and address)
    const contractABI = ABI;
    const contractAddress = Address;
    
    // Create a new contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Call a read-only (view) function
    async function readContractData(eventId) {
        try {
            const result = await contract.methods.getEventDetails(eventId).call();
            console.log("Data from contract:", result);
        } catch (error) {
            console.error("Error reading contract data:", error);
        }
    }

    return (
        <button onClick={() => {readContractData(1)}}>get Details</button>
    );
}

export default Web3Comp;