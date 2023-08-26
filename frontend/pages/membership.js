import {BsCheck2Circle} from "react-icons/bs";
import { Web3Storage } from "web3.storage";
import { stateContext } from "../context/stateContext";
import { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from "ethers";
export default function Membership() {
    const {connectWallet, connected,account,provider,ownerAddress} = useContext(stateContext);
    const web3storage_key = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;
    const nftport_key = process.env.NEXT_PUBLIC_NFTPORT_KEY;
    const [msg,setMsg] = useState("Join for 2 Matic");

    function makeFileObjects (data) {
        const obj = data;
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
      
        const files = [
          new File([blob], account+'.json')
        ]
        return files
    }
    //creating and storing the membership details of user in web3.storage
    const storeContent = async () => {
        let data = {"name":"Block State Pro Membership","image":"ipfs://QmeyFd24Z9G2RVRMtHoP8eEyAqBXGocHYCEYGvGhrRRHES"};
        data.user = account;
        data.BoughtDate = new Date();
        data.time = new Date().getTime();
        const client = new Web3Storage({ token: web3storage_key });
        const files = makeFileObjects(data);
        const cid = await client.put([files[0]],{
          name: "Block state membership " + account,
        });
        console.log(cid);
        return ("ipfs://"+cid);
    };
    //minting a membership NFT for the user using NFTport
    const buyMembership = async () => {
        try{
            setMsg("Processing...");
            const link = await storeContent();
            const tx = await provider.sendTransaction({to:ownerAddress,value:ethers.utils.parseEther("2")});
            await tx.wait();
            setMsg("Minting NFT...");
            //minting nft using NFTport
            const options = {
                method: 'POST',
                url: 'https://api.nftport.xyz/v0/mints/customizable',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: nftport_key
                },
                data: {
                    chain: 'polygon',
                    contract_address: '0x3c89889a666141059d8b896d17dde131fcbb1787',
                    metadata_uri: link,
                    mint_to_address: account,
                }
            };

            axios.request(options).then(function (response) {
            console.log(response.data);
            }).catch(function (error) {
            console.error(error);
            });
            setMsg("joined Successfully");
            toast("Successfully bought membership");
        }
        catch(err){
            alert(err);
            setMsg("Join for 2 Matic");
        }
    }
    return (
        <div className="px-40 text-white mt-2">
            <div className="flex items-center flex-col p-10 text-lg">
                <p className="text-lg">Join the buyers community of BlockState which helps you to promote your properties to our thousands of buyers.</p>
                <div className="flex items-center flex-col mt-8 gap-4 text-lg p-10 border-2 rounded-r-3xl">
                    <h1 className="text-xl font-bold tracking-widest underline underline-offset-2">Block State Pro Membership</h1>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Buyer Community Access</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Special Pro Member NFT</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Zero Listing Charge</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Unlimited Listing</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Zero promoting Charges</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Free Access To Special Events</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> Beta Features Access</p>
                    <p className="flex items-center gap-3"> <BsCheck2Circle className="text-xl"/> 24/7 Support</p>
                    {
                        connected ?
                            <button onClick={buyMembership} className="p-3 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg">{msg}</button>
                        :
                            <button onClick={connectWallet} className="p-3 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg">Connect Wallet</button>
                    }
                </div>
            </div>
            <ToastContainer />

        </div>
    )
}