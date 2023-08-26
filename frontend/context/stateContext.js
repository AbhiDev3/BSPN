import {createContext,useState} from 'react';
import NavBar from '../components/Navbar';
import {ethers} from 'ethers';
import {abi,contract_address,erc721_abi,member_contract} from "../constants/index";
import { SiweMessage } from 'siwe';
export const stateContext = createContext();

export default function Layout({children}){
    
    const [connected, setConnected] = useState(false);
    const [provider,setProvider] = useState(null);
    const [contract,setContract] = useState(null);
    const [account,setAccount] = useState(null);
    const [owner,setOwner] = useState(false);
    const [member,setMember] = useState(false);
    const [ownerAddress,setOwnerAddress] = useState(null);
    const [maticPrice,setMaticPrice] = useState(0);
    const RPC = process.env.NEXT_PUBLIC_RPC;
    const prov = new ethers.providers.JsonRpcProvider(RPC);
    const erc721 = new ethers.Contract(member_contract,erc721_abi,prov);
    const networks = {
        mumbai: {
          chainId: `0x${Number(80001).toString(16)}`,
          chainName: "Mumbai Testnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        }
    }
    // Siwe message creator for mumbai testnet
    function createSiweMessage(address, statement) {
        const domain = window.location.host;
        const origin = window.location.origin;
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: '80001'
        });
        return message.prepareMessage();
    }

    const connectWallet = async () => {
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum,"any");           
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner(account);
            if(await signer.getChainId() != 80001){
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            ...networks["mumbai"]
                        }
                    ]
                })
            }
            //Sign in With Polygon
            const message = createSiweMessage(
                await signer.getAddress(),
                'Sign in with Polygon to the app.'
            );
            await signer.signMessage(message);
            setProvider(signer);
            const userAddress = await signer.getAddress();
            setMember(await erc721.balanceOf(userAddress) > 0);
            const contract = new ethers.Contract(contract_address,abi,signer);
            const ownerAdd = await contract.owner();
            setOwner(ownerAdd.toLowerCase()==userAddress.toLowerCase());
            setConnected(true);
            setContract(contract);
            setAccount(userAddress);
            setOwnerAddress(ownerAdd);
            //Getting Spot price of MATIC Using Tellor Data Feed
            const price = await contract.getMaticSpotPrice();
            setMaticPrice(Number(price.toString().slice(0,5))/100000);
        }
        catch(err){
            alert(err.message);
        }
    }
    const disconnect = async() => {
        setConnected(false);
        setProvider(null);
        setContract(null);
        setAccount(null);
    }
    return(
        <stateContext.Provider value={{
            connected,
            provider,
            contract,
            account,
            connectWallet,
            disconnect,
            provider,
            owner,
            ownerAddress,
            member,
            maticPrice
        }}>
            <NavBar />
            {children}
        </stateContext.Provider>
    )
}