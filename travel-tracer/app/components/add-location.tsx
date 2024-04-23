
import * as React from "react"


import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronsUpDown, Plus} from "lucide-react"
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {Input} from "@/components/ui/input";
import {ChangeEvent, useState} from "react";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Badge} from "@/components/ui/badge";

interface AddLocationProps {
    onAdd : (loc)=> void
}

// 新增地点
export const AddLocation = ({onAdd}: AddLocationProps)=> {
    const [isOpen, setIsOpen] = React.useState(false)
    const REGEXP_LNG_IAT = "^[0-9.-]+$";
    const [value,setValue] = useState("");
    // 绑定经度
    const [lng, setLng] = React.useState("")
    const [lat,setLat] =   React.useState("")
    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setValue(e.target.value);
    }

    const queryResult =  useQuery(api.locations.get, {name: value});

    const handleClick = (e,res)=>{

        console.log("click triggered!");
        onAdd(res)
        setValue("")
    }

    const handleAddInput = () =>{
        let data = {
            name: value,
            lng: lng,
            lat: lat
        }
        onAdd(data)
        setValue("")
        setLat("")
        setLng("")
    }



    return (
        <>
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-[350px] space-y-2"
        >
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                    请输入地点名称：
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md  px-4 py-2 font-mono text-sm shadow-sm">
                <Input placeholder="输入地点" onChange={handleChange} value = {value}/>
            </div>
            <CollapsibleContent className="space-y-2">
                <div className="px-4 py-2 font-mono text-sm shadow-sm">
                    <h4 className="text-sm font-semibold">
                        请输入经度（-180 度到 +180 度）：
                    </h4>
                    <InputOTP maxLength={6} pattern={REGEXP_LNG_IAT}  value={lng}
                              onChange={(value) => setLng(value)}>
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
                    <InputOTP maxLength={6} pattern={REGEXP_LNG_IAT} value={lat} onChange={(value) => setLat(value)}>
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

                <Button onClick={handleAddInput}>
                    <Plus></Plus> 新增标记点
                </Button>

            </CollapsibleContent>

        </Collapsible>

            {queryResult && queryResult.length > 0 && <div className = "flex flex-wrap gap-x-2 gap-y-2 max-w-[600px]" >
                <div> 您可以从下列候选项中选择最接近的坐标点:</div>

                {
                    queryResult?.map(res => (
                        <Badge variant="outline" key = {res._id} onClick={event => handleClick(event, res)}>
                            {res.name } [<span className = "text-red-300">{res.lng}</span>,<span className = "text-green-800">{res.lat}</span>]
                        </Badge>
                    ))
                }
            </div>
            }
        </>
    )
}