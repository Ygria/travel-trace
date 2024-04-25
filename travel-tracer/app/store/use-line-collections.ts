import {create} from "zustand";

import {nanoid} from "nanoid";



interface ILineCollection {
    lineCollections: LineCollections[],
    addLineCollection: ()=>void,
    dropLocation: (id:string, loc: {name:string,id: string})=>void,
    removeLineCollection:(id: string) => void,
    updateLocations:(id:string,lineData: {name: string,id:string}[]) => void

}

interface LineCollections {
    id: string,
    locIds: {name: string,id:string}[]

}




export const useLineCollections = create<ILineCollection>((set,getState) => ({
    lineCollections: [{
        id: "default",
        locIds: []
    }],



    //  新增
    addLineCollection(){
       const _id  = nanoid()
            let col = {
                "id": _id,
                "locIds": []
            }
            set(state => ({
                lineCollections: [col,...state.lineCollections]
            }));
    },

    removeLineCollection(id:string){
        if(getState().lineCollections.length > 1){
            set(state => ({
                lineCollections: state.lineCollections.filter(item=>item.id !== id)
            }));

        }else if(getState().lineCollections.length == 1){
            set(state => ({
              lineCollections:[{
                  id: "default",
                  locIds: []
              }],
            }));
        }


    },
    dropLocation(id: string, loc:{name: string,id:string}){
        set(state => ({
            lineCollections: state.lineCollections.map(item=>{
                if(item.id === id){
                   return {
                       ...item,
                       locIds: [...item.locIds,loc]
                   }
                }else {
                    return item
                }
            })
        }));

    },

    updateLocations(id:string,lineData: {name: string,id:string}[]){
        set(state => ({
            lineCollections: state.lineCollections.map(item=>{
                if(item.id === id){
                    return {
                        ...item,
                        locIds: lineData
                    }
                }else {
                    return item
                }
            })
        }));

    }


}));


