import { MdLocationOn } from 'react-icons/md';
import { ImCross } from 'react-icons/im';
import {FiSend} from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { useContext,useEffect,useState } from "react";
import { stateContext } from "../context/stateContext";
import { ethers, providers } from 'ethers';
import { Client } from '@xmtp/xmtp-js'
import { connect } from "@tableland/sdk";
import Msg from './msg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NftDetails(props){
    const {contract,connectWallet, connected,account,provider,maticPrice} = useContext(stateContext);
    const [open,setOpen] = useState(false);
    const [xmtp,setXmtp] = useState(null);
    const [conversation,setConversation] = useState(null);
    const owner = props.owner;
    let [messages,setMessages] = useState([])
    const price = maticPrice == 0 ? 0.765 : maticPrice;
    const buyNft = async () => {
        try{
            const tx = await contract.createMarketSale(props.id,{from:account,value:ethers.utils.parseEther(""+props.price)});
            await tx.wait();
            const tableland = await connect({ network: "testnet", chain: "polygon-mumbai" });
            const table_name = process.env.NEXT_PUBLIC_TABLE_NAME;;
            const updateRes = await tableland.write(`UPDATE ${table_name} SET sold = 'true' WHERE id = ${props.id};`);
            console.log(updateRes);
            toast.success("NFT bought successfully");
        }
        catch(err){
            alert(err);
        }
    }

    const rentNft = async () => {
        try{
            var date = new Date();
            date.setDate(date.getDate() + 30);
            const tx = await contract.rentOutToken(props.id,date.getDate(),{from:account,value:ethers.utils.parseEther(props.rentPrice+"")});
            await tx.wait();
            const tableland = await connect({network: "testnet", chain: "polygon-mumbai" });
            const table_name = process.env.NEXT_PUBLIC_TABLE_NAME;;
            const updateRes = await tableland.write(`UPDATE ${table_name} SET rent = 'false' WHERE id = ${props.id};`);
            console.log(updateRes);
            toast.success("NFT rented successfully");
        }
        catch(err){
            alert(err);
        }
    }
    

    const messageOwner = async () => {
        try{
            setOpen(true);
        }
        catch(err){
            alert(err);
        }
    }

    const closeMsg = () => {
        setOpen(false);
    }
    
    //sending and loading the messages
    const sendMsg = async () => {
        try{
            const text = document.getElementById("msg").value;
            await conversation.send(text);
            setMessages([[text,account],...messages]);
            for await (const message of await conversation.streamMessages()) {
                setMessages([[message.content,message.senderAddress],...messages]);
            }
        }
        catch(err){
            alert(err);
        }
    }
    //setting up xmtp
    const settingXmtp = async () => {
        try{
            const xmtp = await Client.create(provider);
            setXmtp(xmtp);
            const conversation = await xmtp.conversations.newConversation(
                owner
            )
            setConversation(conversation);
        }
        catch(err){
            alert(err);
        }
    }
    useEffect(() => {
        if(open && connected && xmtp == null){
            settingXmtp();
        }
    },[connected,open])

    
    return (
        <div>

            {
                open 
                ? 
                <div className="mt-4 mx-40 bg-gray-300 px-10 py-4 rounded-xl">
                    <ImCross className='h-6 w-6 p-1 ml-auto hover:bg-black hover:text-white hover:rounded-full hover:cursor-pointer' onClick={closeMsg}/>
                    <div className='flex flex-col justify-between h-128'>
                        <span> To :  {owner}</span>
                        <div className='h-96 flex '>
                            <div className='flex flex-col-reverse gap-2'>
                                {
                                    messages.reverse().map((msg,index) => {
                                        return <Msg key={index} owner={msg[1]} message={msg[0]}/>
                                    }
                                    )
                                }
                            </div>
                        </div>
                        {
                            connected ?
                                <div className='flex items-center gap-2'>
                                    <input type="text" id="msg" className="w-full text-white h-10 bg-gray-800 rounded-lg focus:outline-none pl-2" placeholder="Enter message..."/>
                                    <FiSend className='h-6 w-6 hover:cursor-pointer' onClick={sendMsg}/>
                                </div>
                            :
                                <button className='bg-black text-white px-4 py-2 rounded-lg' onClick={connectWallet}>Connect Wallet</button>
                        }
                    </div>
                    <div className='uppercase flex flex-col items-center mt-6 text-md'><span>powered by <span className='underline-offset-4'>xmtp</span></span></div>
                </div>
                :
                <div className="text-white pt-4 px-40">
                    <div className='flex flex-row-reverse mt-2'>
                        <button className="bg-white p-2 rounded-md text-black" onClick={props.closeSelect}>Close</button>
                    </div>
                    <div className='flex'>
                        <img className="h-128 w-128 rounded-md" src={props.image}></img>
                        <div className='pl-10 w-128'>
                            <div className="text-3xl font-bold">
                                {props.name}
                            </div>
                            <div className='py-2 text-xl'>
                                {props.details}
                            </div>
                            {props.description}
                            <div className='flex items-center gap-2 py-2'>
                                <MdLocationOn /> {props.location}
                            </div>
                            <div className='flex w-fit bg-zinc-900 rounded-xl p-5 justify-between flex-col'>
                                <div className='flex justify-between gap-10'>
                                <div>
                                    {
                                        props.sale=="true" && 
                                        <div className='bg-zinc-800 p-2 rounded-md w-36'>
                                            <div className='text-zinc-400 text-sm'>price</div>
                                            <div>{props.price} MATIC</div>
                                            <div className='text-zinc-400 text-md'>${Math.round(props.price * price *10000)/10000}</div>
                                        </div>
                                    }
                                </div>
                                <div>
                                    {
                                        props.rent=="true" &&
                                        <div className='bg-zinc-800 p-2 rounded-md w-36'>
                                            <div className='text-zinc-400 text-sm'>rent price</div>
                                            <div>{props.rentPrice} MATIC</div>
                                            <div className='text-zinc-400 text-md'>${Math.round(props.rentPrice * price *10000)/10000}</div>
                                        </div>
                                    }
                                </div>
                                </div>
                                
                                {
                                    connected ?
                                        <div className='flex justify-between'>
                                            {props.sale == "true" && <button onClick={buyNft} className='mt-3 w-36 p-2 bg-white text-black rounded-2xl hover:bg-gray-100'>Buy</button>}
                                            {props.rent == "true" && <button onClick={rentNft} className='mt-3 w-36 p-2 bg-white text-black rounded-2xl hover:bg-gray-100'>Rent</button>}
                                        </div>
                                    :
                                        <button className='mt-4 w-full p-2 bg-white text-black rounded-2xl hover:bg-gray-100' onClick={connectWallet}>Connect wallet</button>
                                }
                            </div>
                            
                            <div className='flex gap-16 pl-1 py-4 items-center'>
                                <div className=''>Owned By {owner.slice(0,5)}...{owner.slice(37)}</div>
                                <div className='flex items-center p-2 bg-blue-600 rounded-xl gap-2 hover:cursor-pointer' onClick={messageOwner}>
                                    <BiMessageSquareDetail />
                                    <h1>Message owner</h1>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                }
                            <ToastContainer />
            </div>
    )
}