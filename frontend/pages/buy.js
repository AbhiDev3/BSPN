import NftCard from "../components/nftCard"
import NftDetails from "../components/nftDetails"
import { connect } from "@tableland/sdk";
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Buy(){
    const [selected,setSelected] = useState(null);
    const [data,setData] = useState([]);

    const clickSelect = (item) => {
        setSelected(item);
    }

    const closeSelect = () => {
        setSelected(null);
        getData();
    }
    //getting data from tableland exceptialy the non sold ones
    const getData = async() => {
        try{
            const tableland = await connect({ network: "testnet", chain: "polygon-mumbai" });
            const table_name = process.env.NEXT_PUBLIC_TABLE_NAME;
            const readRes = await tableland.read(`SELECT * FROM ${table_name} WHERE sale = "true" AND sold = "false";`);
            setData(readRes["rows"]);
        }

        catch(err){
            alert(err);
        }
    }
    
    console.log(data);
    useEffect(() => {
        getData();
    },[])
    return(
        
            selected === null ?
            
            <div className="grid grid-cols-4 gap-2 px-40 text-white mt-4">
                {data.map((item) => {
                    return(<NftCard key={item.id} item={item} name={item[1]} price={item[2]} details={item[5]} location={item[6]} image ={item[7]} clickSelect={clickSelect}/>)})}
            </div>
            
            :

            <div className="">
                <NftDetails key={selected[0]} id={selected[0]} name={selected[1]} sale={selected[9]} rent = {selected[8]} price={selected[2]} rentPrice={selected[3]} description={selected[4]} details={selected[5]} location={selected[6]} image ={selected[7]} owner={selected[11]} closeSelect ={closeSelect}/>
            </div>

        
    )
}