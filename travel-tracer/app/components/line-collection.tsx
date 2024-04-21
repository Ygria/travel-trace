
import { MapPinned} from "lucide-react"
import {ConnectDropTarget, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {Overlay, OverlayType} from "@/app/components/Overlay";
import {useEffect, useRef, useState} from "react";
import {ArrowBigRight} from "lucide-react"
import {Reorder} from "framer-motion";

interface LineCollectionProp {
    updateData: (lineData: string[]) => void;
}
export const LineCollection = ({updateData} : LineCollectionProp)=>{


    const [lineData,setLineData] = useState<string[]>([]);

    useEffect(() => {
        updateData(lineData)
    }, [lineData]);



    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver,canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.Location,
            canDrop: () => true,
            drop: (item:{name: string}) => {
                setLineData([...lineData,item.name])

            },

            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [lineData],
    )

    return (
        <>
            <div className="h-[120px] m-2 min-w-[400px] p-2 border-dashed border-2 border-i-200 flex flex-wrap items-center justify-center" ref={drop}

                 style={{
                     position: 'relative',
                 }}>


                {   lineData.length == 0 &&  <MapPinned></MapPinned>}
                <Reorder.Group values={lineData} onReorder = {setLineData} axis="x" >
        
                {
                    lineData.map((loc,index)=>(
                        <Reorder.Item value={loc} key = {loc.nam}>
                        <>

                            <span className = "mr-2">{loc.name}</span>

                            {index != lineData.length - 1 && <ArrowBigRight />
                            }
                            </>
                        </Reorder.Item>
                    ))
                }
                    </Reorder.Group>

                {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
                {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
                {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />}
            </div>
        </>
    )

}