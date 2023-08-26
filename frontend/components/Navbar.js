import Link from "next/link";
import { stateContext } from "../context/stateContext";
import { useContext, useState, useEffect } from "react";
import { namehash } from 'eth-ens-namehash';

const NavBar = (props) => {
  const { connectWallet, connected, disconnect, owner } = useContext(stateContext);
  const [ensName, setEnsName] = useState(""); // State to hold ENS name

  useEffect(() => {
    // Check if the connected address has an ENS domain
    async function fetchEnsName() {
      if (connected) {
        try {
          const ensAddress = await namehash(`${owner}.addr.reverse`);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const ensLookup = new ethers.ENS(provider);
          const resolvedEnsName = await ensLookup.getName(ensAddress);
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
          BLOCK STATE<img src="/logo.png" className="max-h-14 w-55"></img>{" "}
        </a>
      </Link>
      <div className="flex items-center gap-10">
        {/* ... other links */}
        {
          connected ?
            <button className="">{ensName || owner}</button>
          : null
        }
      </div>
    </div>
  );
};

export default NavBar;
