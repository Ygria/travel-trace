import {create} from "zustand";
const defaultValues = {
    name: "",
    lng: "",
    lat: "",
   id: ""
};


interface IEditModal {
    isOpen: boolean;
    initialValues: typeof defaultValues;
    onOpen: (id:string,name:string,lng: string,lat: string) =>void;
    onClose: () => void;
}


export const useEditModal = create<IEditModal>((set) =>({
    isOpen: false,
    onOpen:(id:string,name,lng,lat)=>set({
        isOpen:true,
        initialValues: {id,name,lng,lat}
    }),
    onClose: ()=>set({
        isOpen: false,
        initialValues: defaultValues
    }),
    initialValues: defaultValues

}))