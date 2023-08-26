import { useState } from "react";
export default function Dashboard() {
    const [data,setData] = useState([]);
    const covelentKey = process.env.NEXT_PUBLIC_COVALENT_KEY;

    //getting tokens minted using covalent api
    const getTokens = async () => {
        try{
            const response = await fetch(`https://api.covalenthq.com/v1/80001/tokens/0x3bEB0B90392FAf7832a3c1651Cbe978f15565D71/nft_token_ids/?quote-currency=USD&format=JSON&key=${covelentKey}`);
            const data = await response.json();
            console.log(data);
            const len = data.data.items.length;
            setData((len));
        }
        catch(err){
            alert(err);
        }
    }
    //getting the original owner of the token using covalent api
    const getOwner = async () => {
        try{
            const id = document.getElementById("id").value;
            const response = await fetch(`https://api.covalenthq.com/v1/80001/tokens/0x3bEB0B90392FAf7832a3c1651Cbe978f15565D71/nft_metadata/${id}/?quote-currency=USD&format=JSON&key=${covelentKey}`);
            const data = await response.json();
            setData(data.data.items[0].nft_data[0].original_owner);
        }
        catch(err){
            alert(err);
        }
    }
    //getting metadata of the token using covalent api
    const getMetadata = async () => {
        try{
            const id = document.getElementById("token").value;
            const response = await fetch(`https://api.covalenthq.com/v1/80001/tokens/0x3bEB0B90392FAf7832a3c1651Cbe978f15565D71/nft_metadata/${id}/?quote-currency=USD&format=JSON&key=${covelentKey}`);
            const data = await response.json();
            setData(data.data.items[0].nft_data[0].token_url);
        }
        catch(err){
            alert(err);
        }
    }

    return (
        <div className=" bg-black text-white px-40 flex justify-between mt-20">
            <div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-gray-300 text-xl">Get number of tokens minted</h1>
                    <button className="p-2 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg w-32" onClick={getTokens}>GET</button>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <h1 className="text-gray-300 text-xl">Get owner of token</h1>
                    <input type="text" placeholder="Enter the TokenId" className="focus:outline-none rounded-sm p-1 bg-gray-600 border-none" id="id"/>
                    <button className="p-2 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg w-32" onClick={getOwner}>GET</button>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                    <h1 className="text-gray-300 text-xl">Get metadata of token</h1>
                    <input type="text" placeholder="Enter the TokenId" className="focus:outline-none rounded-sm p-1 bg-gray-600 border-none" id="token"/>
                    <button className="p-2 bg-blue-600 text-white rounded-md  hover:bg-blue-700 hover:shadow-lg w-32" onClick={getMetadata}>GET</button>
                </div>
            </div>
            <div className="bg-gray-600 w-1/2  rounded-md p-5 break-all">
                
                {data}
                
            </div>
        </div>
    )
}