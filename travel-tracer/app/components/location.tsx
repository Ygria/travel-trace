import {MapPin} from "lucide-react"
import { DragPreviewImage, useDrag } from 'react-dnd'
import {useRef} from "react";
import {ItemTypes} from "@/app/components/ItemTypes";
interface LocationProps {
    name: string;

}



export const Location = ({name}:LocationProps) => {

    const ref = useRef<HTMLDivElement>(null)
    const [{ isDragging }, drag, preview] = useDrag(
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
        <div className = "flex gap-x-4 m-2" ref={drag}
              style={{
                  opacity: isDragging ? 0.5 : 1,
              }}><MapPin />{name}</div>
        </>
    )
}