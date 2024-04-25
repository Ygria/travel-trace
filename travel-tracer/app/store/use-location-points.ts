import {create} from "zustand";

import {nanoid} from "nanoid";



interface ILocationPoints {
   locations: LocationPoint[],
    addLocation: (loc: LocationPoint)=>void,
    editLocation: (loc: LocationPoint)=>void,
    removeLocation: (id:string)=>void
}

interface LocationPoint{
    id: string,
    name: string,
    lng: string,
    lat: string

}


export const useLocationPoints = create<ILocationPoints>(set => ({
    locations: [] as LocationPoint[],
    addLocation: (loc: LocationPoint) => {
        const _id  = nanoid()
        loc["id"] = _id
        set(state => ({
            locations: [...state.locations, loc]
        }));
    },

    editLocation: (loc: LocationPoint)=>{
        set(state => ({
            locations: state.locations.map(item=>{
                if(item.id === loc.id){
                    return {
                        ...loc,
                        id: item.id,
                    }
                }else {
                    return item
                }
            })
        }));

    },
    // 移除location
    removeLocation:(id:string)=>{
        set(state => ({
            locations: state.locations.filter(item=>item.id !== id)
        }));
    }
}));


