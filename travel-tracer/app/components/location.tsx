import {MapPin,X,Pencil} from "lucide-react"
import { DragPreviewImage, useDrag } from 'react-dnd'
import {MouseEvent, MouseEventHandler, useRef, useState} from "react";
import {ItemTypes} from "@/app/components/ItemTypes";
import {EditLocation} from "./edit-location"
import {useEditModal} from "@/app/store/use-edit-modal";
interface LocationProps {
    index: number
    name: string;
    lng: string;
    lat: string
    onRemove: (e:MouseEvent<HTMLButtonElement>)=>void


}



export const Location = ({index,name,lng,lat,onRemove,}:LocationProps) => {

    const {onOpen} = useEditModal();

    const ref = useRef<HTMLDivElement>(null)
    const [{ isDragging, }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.Location,
            item: { name } ,

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
            <button className = "opacity-0 group-hover:opacity-100" onClick={()=>onOpen(index,name,lng,lat)} ><Pencil size = "16"></Pencil> </button>
            <button className = "opacity-0 group-hover:opacity-100" onClick={onRemove} ><X size = "16"></X> </button>
        </div>


        </>
    )
}