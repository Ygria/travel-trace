import {create} from "zustand";
const defaultValues = {
    name: "",
    lng: "",
    lat: "",
    index: -1
};


interface IEditModal {
    isOpen: boolean;
    initialValues: typeof defaultValues;
    onOpen: (index:number,name:string,lng: string,lat: string) =>void;
    onClose: () => void;
}


export const useEditModal = create<IEditModal>((set) =>({
    isOpen: false,
    onOpen:(index,name,lng,lat)=>set({
        isOpen:true,
        initialValues: {index,name,lng,lat}
    }),
    onClose: ()=>set({
        isOpen: false,
        initialValues: defaultValues
    }),
    initialValues: defaultValues

}))