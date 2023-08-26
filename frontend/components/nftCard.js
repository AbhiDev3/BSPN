import { MdLocationOn } from 'react-icons/md';

export default function NftCard(props){
    return(
        <div className="p-4 flex flex-col gap-2" onClick={()=>props.clickSelect(props.item)}>
            <img className="h-52 rounded-md" src={props.image} alt="home.jpeg"></img>
            <div className="p-1 flex justify-between">
                <h1>{props.name}</h1>
                <p>{props.price} MATIC</p>
            </div>
            <div className='pl-1'>
                {props.details}
            </div>
            <div className='flex items-center gap-2'>
                <MdLocationOn /> {props.location}
            </div>
        </div>
    )
}