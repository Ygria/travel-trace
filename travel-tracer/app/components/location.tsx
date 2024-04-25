import {MapPin,X,Pencil} from "lucide-react"
import { useDrag } from 'react-dnd'
import {MouseEvent, useRef, useState} from "react";
import {ItemTypes} from "@/app/components/ItemTypes";
import {useEditModal} from "@/app/store/use-edit-modal";
interface LocationProps {
    id: string
    name: string;
    lng: string;
    lat: string
    onRemove: (e:MouseEvent<HTMLButtonElement>)=>void


}



export const Location = ({id,name,lng,lat,onRemove,}:LocationProps) => {

    const {onOpen} = useEditModal();

    const ref = useRef<HTMLDivElement>(null)
    const [{ isDragging, }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.Location,
            item: { name: name,id:id } ,

            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [],
    )

    return (
        <>
        <div className = "flex gap-x-2 m-2 relative group" ref={drag}
              style={{
                  opacity: isDragging ? 0.5 : 1,
              }}><MapPin />{name}
            <button className = "opacity-0 group-hover:opacity-100" onClick={()=>onOpen(id,name,lng,lat)} ><Pencil size = "16"></Pencil> </button>
            <button className = "opacity-0 group-hover:opacity-100" onClick={onRemove} ><X size = "16"></X> </button>
        </div>


        </>
    )
}