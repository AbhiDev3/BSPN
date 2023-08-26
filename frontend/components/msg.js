export default function Msg(props){
    return(
        <div className="flex items-center gap-3">
            <div className="border-2 rounded-full border-black p-1 text-sm">
                {props.owner.slice(0,6)+"..."+props.owner.slice(-3)}
            </div>
            <div>
                {props.message}
            </div>
        </div>
    )
}