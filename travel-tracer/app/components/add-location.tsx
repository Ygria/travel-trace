
import * as React from "react"



import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronsUpDown, Plus,Search,Info} from "lucide-react"
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {Input} from "@/components/ui/input";
import {ChangeEvent, useState} from "react";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Badge} from "@/components/ui/badge";
import { getGeoCode} from "./../../api/gaode"
import {useLocationPoints} from "@/app/store/use-location-points";
import {toast} from "sonner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"


// 新增地点
export const AddLocation = ()=> {
    const [isOpen, setIsOpen] = React.useState(false)
    const REGEXP_LNG_IAT = "^[0-9.-]+$";
    const [value,setValue] = useState("");
    // 绑定经度
    const [lng, setLng] = React.useState("")
    const [lat,setLat] =   React.useState("")

    const {locations,addLocation} = useLocationPoints();
    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setValue(e.target.value);
        if(!e.target.value){
            //  清空内容时，将搜索结果也存储为空！
            setGaodeQueryResult([])
        }
    }

    const queryResult =  useQuery(api.locations.get, {name: value});
    const [gaodeQueryResult,setGaodeQueryResult] = useState([]);

    const handleClick = (e,res)=>{

        console.log("click triggered!");
        addLocation(res)
        setValue("")
        setGaodeQueryResult([])
    }

    const handleAddInput = () =>{
        let data = {
            name: value,
            lng: lng,
            lat: lat
        }
        addLocation(data)
        setValue("")
        setLat("")
        setLng("")
    }

    const searchGeoCode = () =>{
        let queryResult = getGeoCode(value);
        queryResult.then(res=>{
            if(res && res.length > 0){
                let data  = res.map(item=>{
                    return {
                        "name": item.formatted_address,
                        "lng": item.location.split(",")[0],
                        "lat": item.location.split(",")[1],
                    }
                })

                setGaodeQueryResult(data)
            }else{
                setGaodeQueryResult([])
                toast.error("未能查询到该地点！您可以通过经纬度进行查询。")
            }
        })


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
                        <span className = "text-slate-400">经纬度</span>
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="flex  items-center rounded-md  px-4 py-2 font-mono text-sm shadow-sm">
                <Input placeholder="输入地点" onChange={handleChange} value = {value}/> <Search className = "ml-2" onClick={searchGeoCode} />
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



            <div className = "flex flex-wrap gap-x-2 gap-y-2 max-w-[600px]" >
                <Alert>
                    <Info className="h-4 w-4" />

                    <AlertDescription>
                        从候选项中点击，或点击“经纬度”，自定义标记点。键入或点击🔍进行候选项搜索。
                    </AlertDescription>
                </Alert>
                {
                    gaodeQueryResult?.map(res => (
                        <Badge variant="outline" key = {res.name} onClick={event => handleClick(event, res)}>
                            {res.name }[<span className = "text-red-300">{res.lng}</span>,<span className = "text-green-800">{res.lat}</span>]
                        </Badge>
                    ))
                }

                {
                    queryResult?.map(res => (
                        <Badge variant="outline" key = {res._id} onClick={event => handleClick(event, res)}>
                            {res.name } [<span className = "text-red-300">{res.lng}</span>,<span className = "text-green-800">{res.lat}</span>]
                        </Badge>
                    ))
                }
            </div>

        </>
    )
}