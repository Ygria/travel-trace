
import {MapPinned, Pencil, X,Trash2} from "lucide-react"
import {ConnectDropTarget, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {Overlay, OverlayType} from "@/app/components/Overlay";
import {useEffect, useRef, useState} from "react";
import {ArrowBigRight} from "lucide-react"
import {useLocationPoints} from "@/app/store/use-location-points";
import {useLineCollections} from "@/app/store/use-line-collections";


interface LineCollectionProp {
    id: string

}
export const LineCollection = ({id} : LineCollectionProp)=>{


    const {dropLocation,removeLineCollection,updateLocations} = useLineCollections()

    const lineData = useLineCollections(s=>s.lineCollections.find(
        item=>item.id === id
    )?.locIds)

    const {locations,addLocation,removeLocation} = useLocationPoints();
    useEffect(() => {
        let latestLineData = lineData?.filter(item=>locations.find(loc=>loc.id === item.id)
        ).map(item=>{
            return {
                id: item.id,
                name: locations.find(loc=>loc.id === item.id)?.name || ""
            }
        }) || []
        updateLocations(id,latestLineData)




    }, [locations]);




    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver,canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.Location,
            canDrop: (item:{name: string,id:string}) => {
                if(!lineData || lineData.length == 0){
                    return true
                }else{
                    return lineData[lineData.length - 1]?.id !== item.id
                }
            },
            drop: (item:{name: string,id:string}) => {

                dropLocation(id, item)

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

            {lineData && <div className="relative group h-[120px] m-2 mr-[20px] min-w-[400px] p-2 border-dashed border-2 border-i-200 flex flex-wrap items-center justify-center" ref={drop}
                 key={id}
                 style={{
                     position: 'relative',
                 }}>


                {   lineData?.length == 0 &&  <MapPinned></MapPinned>}

        
                {
                    lineData?.map((loc,index)=>(

                        <>

                            <span className = "mr-2" key = {loc.id}>{loc.name}</span>

                            {index != lineData?.length - 1 && <ArrowBigRight />
                            }
                            </>

                    ))
                }


                {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
                {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
                {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />}

                <button className = "opacity-0 group-hover:opacity-100 absolute right-[-22px]" onClick={()=>removeLineCollection(id)} ><Trash2 size = "16"></Trash2> </button>

            </div>
            }


        </>
    )

}