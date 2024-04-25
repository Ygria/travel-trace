
import { FormEventHandler, useEffect, useState} from "react";

import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogClose,DialogFooter,DialogTitle} from "@/components/ui/dialog"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {toast} from "sonner";
import {useEditModal} from "@/app/store/use-edit-modal";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import * as React from "react";
import {useLocationPoints} from "@/app/store/use-location-points";




export const EditLocation = () => {
    const REGEXP_LNG_IAT = "^[0-9.-]+$";
    const {isOpen,onClose,initialValues} = useEditModal();
    const [value,setValue] = useState(initialValues.name)
    const [lng,setLng] = useState(initialValues.lng)
    const [lat,setLat]  = useState(initialValues.lat)

    const {locations,addLocation,editLocation} = useLocationPoints();
    const onSubmit : FormEventHandler<HTMLFormElement>= (e)=>{
        e.preventDefault();

        editLocation({
            id: initialValues.id,
            name:value,
            lng: lng,
            lat: lat
        })
        onClose();

    }



    useEffect(() => {
        setValue(initialValues.name)
        setLng(initialValues.lng)
        setLat(initialValues.lat)

    }, [initialValues.name,initialValues.lat,initialValues.lng]);





    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        编辑标记点: {initialValues.name}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    您可以输入新的标记点名称，用于地图上的显示
                </DialogDescription>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input  required maxLength={60} value={value}
                           placeholder="标记点名称"
                            onChange={(e)=>setValue(e.target.value)}
                    ></Input>

                    <div className="px-4 py-2 font-mono text-sm shadow-sm">
                        <h4 className="text-sm font-semibold">
                            请输入经度（-180 度到 +180 度）：
                        </h4>
                        <InputOTP maxLength={6} pattern={REGEXP_LNG_IAT} value = {lng}    onChange={(value) => setLng(value)} >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />

                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />

                            </InputOTPGroup>

                        </InputOTP>
                    </div>
                        <div className="rounded-md  px-4 py-2 font-mono text-sm shadow-sm">
                            <h4 className="text-sm font-semibold">
                                请输入纬度（-90 度到 +90 度）：
                            </h4>
                            <InputOTP maxLength={6} pattern={REGEXP_LNG_IAT}  value = {lat}    onChange={(value) => setLat(value)}>
                                <InputOTPGroup >
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>

                            </InputOTP>
                        </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type = "button" variant="outline">取消</Button>
                        </DialogClose>
                        <Button  type = "submit">
                            保存
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}