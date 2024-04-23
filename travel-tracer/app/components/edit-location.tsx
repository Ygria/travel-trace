"use client";
import { FormEventHandler, useEffect, useState} from "react";

import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogClose,DialogFooter,DialogTitle} from "@/components/ui/dialog"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {toast} from "sonner";
import {useEditModal} from "@/app/store/use-edit-modal";



export const EditLocation = () => {

    const {isOpen,onClose,initialValues} = useEditModal();
    const onSubmit : FormEventHandler<HTMLFormElement>= (e)=>{
        e.preventDefault();

    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        编辑标记点
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    您可以输入新的标记点名称，用于地图上的显示
                </DialogDescription>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input  required maxLength={60}
                           placeholder="Board title"
                    ></Input>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type = "button" variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button  type = "submit">
                            Save
                        </Button>

                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}