import Link from "next/link";
import { stateContext } from "../context/stateContext";
import { useContext, useState, useEffect } from "react";
import { namehash } from 'eth-ens-namehash';
import { ethers } from "ethers";

const NavBar = () => {
  const { connectWallet, connected, disconnect, owner } = useContext(stateContext);
  const [ensName, setEnsName] = useState(""); // State to hold ENS name

  useEffect(() => {
    // Check if the connected address has an ENS domain
    async function fetchEnsName() {
      if (connected && owner) {
        try {
          const ensAddress = namehash(`${owner.toLowerCase()}.addr.reverse`);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const ensLookup = new ethers.Contract(ensAddress, ['function name(bytes32 node) view returns (string)'], provider);
          const resolvedEnsName = await ensLookup.name(ensAddress);
          setEnsName(resolvedEnsName);
        } catch (error) {
          console.error("Error fetching ENS name:", error);
        }
      }
    }
    fetchEnsName();
  }, [connected, owner]);

  return (
    <div className="w-full flex items-center text-lg justify-between p-3 px-40 shadow-gray-200 shadow-sm text-white tracking-widest">
      <Link href="/">
        <a className="flex items-center text-xl font-bold">
          BLOCK STATE<img src="/logo.png" className="max-h-14 w-55" alt="BlockState Logo"></img>{" "}
        </a>
      </Link>
      <div className="flex items-center gap-10">
        {/* ... other links */}
        {
          connected ?
            <button onClick={disconnect} className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:shadow-lg">
              {ensName || owner}
            </button>
            :
            <button onClick={connectWallet} className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:shadow-lg">
              Sign in With Polygon
            </button>
        }
      </div>
    </div>
  );
};

export default NavBar;
