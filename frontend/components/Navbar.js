
import Link from "next/link"
import { stateContext } from "../context/stateContext";
import { useContext } from "react";

const NavBar = (props) => {
  const {connectWallet, connected ,disconnect,owner} = useContext(stateContext);
  return (
    <div className="w-full flex items-center text-lg justify-between p-3 px-40 shadow-gray-200 shadow-sm text-white tracking-widest" >
      
      <Link href="/">
          <a className="flex items-center text-xl font-bold">BLOCK STATE<img src="/logo.png" className="max-h-14 w-55"></img> </a>
      </Link>
      <div className="flex items-center gap-10">
        {
          owner ? 
            <Link href="/dashboard">
              <a className="p-2 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:rounded-md">Dashboard</a>
            </Link> 
          : 
          null
        }
        <Link href="/airdrop">
          <a className="hover:underline underline-offset-4">Airdrop</a>
        </Link>
        <Link href="/membership">
          <a className="p-2 pl-3 pr-3 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg">Become Member</a>
        </Link>
        <Link href="/buy">
          <a className="hover:underline underline-offset-4">BUY</a>
        </Link>
        <Link href="/sell">
          <a className="hover:underline underline-offset-4">SELL</a>
        </Link><Link href="/rent">
          <a className="hover:underline underline-offset-4">RENT</a>
        </Link>
        {
          !connected ?
            <button onClick={connectWallet} className="p-3 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg">Sign in With Polygon</button>
            :
            <button onClick={disconnect} className="">CONNECTED</button>
        }
      </div>
    </div>
    
  )
}

export default NavBar;
