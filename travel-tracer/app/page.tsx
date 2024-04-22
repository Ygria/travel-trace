"use client"
import Image from "next/image";

import * as echarts from "echarts"
import {Location } from "./components/location"

import 'echarts-gl';
import {Plus,ArrowBigRight,MapPin} from "lucide-react"
import { Input } from "@/components/ui/input"
import {ChangeEvent, useEffect, useState} from "react"

import ReactEcharts from "echarts-for-react"
import {Button} from "@/components/ui/button";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {LineCollection} from "@/app/components/line-collection";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"





import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
export default function Home() {



    interface LocationPoint {
        name: string,
        lng_lat: number[],
        active: number
    }

    interface LineData {
        from: string,
        to: string
    }


    const [value,setValue] = useState("");

    const [locations,setLocations] = useState<LocationPoint[]>([]);
    const [lines,setLines] = useState([]);
    const initSeries = [
        {
            type: "lines3D",
            effect: {
                show: true,
                period: 3, // 尾迹特性周期
                trailLength: 0.1, // 尾迹0~1，线条长度的百分比
            },
            lineStyle: {
                color: "#d9d919",
                width: 2,
                opacity: 0.4,
            },
            data: activeData(lines)
        },
        {
            type: "lines3D",
            lineStyle: {
                color: "#fff",
                width: 2,
                opacity: 0.6,
            },
            data: normalData(lines),
        },
        {
            type: "scatter3D",
            coordinateSystem: "globe",
            zlevel: 3,
            label: {
                show: true,
                position: "bottom",
                formatter: "{b}",
                fontSize: 16,
            },
            itemStyle: {
                color: "#d9d919",
            },
            data: [],
        },
        {
            type: "scatter3D",
            coordinateSystem: "globe", // 使用的坐标系
            zlevel: 3,
            label: {
                show: true,
                position: "bottom",
                formatter: "{b}",
                fontSize: 16,
            },
            itemStyle: {
                color: "#fff",
            },
            data: [],
        },
    ]

    // var linesData = [
    //     // { from: "合肥", to: "南京" },
    //     // { from: "合肥", to: "黄山" },
    //     // { from: "宣城", to: "合肥" },
    //     // { from: "南京", to: "武汉" },
    //     // { from: "南京", to: "上海" },
    //     // { from: "合肥", to: "蚌埠" },
    //     // { from: "合肥", to: "南昌" },
    //     // { from: "合肥", to: "成都" },
    //     // { from: "成都", to: "重庆" },
    //     // { from: "南京", to: "东京" },
    //     // { from: "东京", to: "大阪" },
    //     // { from: "合肥", to: "哈尔滨" },
    //     // { from: "合肥", to: "长沙" },
    //     // { from: "合肥", to: "西宁" },
    //     // { from: "西宁", to: "茶卡盐湖" },
    //     // { from: "茶卡盐湖", to: "敦煌" },
    //     // { from: "敦煌", to: "兰州" },
    //     // { from: "合肥", to: "深圳" },
    //     // { from: "合肥", to: "广州" },
    //     // { from: "合肥", to: "福州" },
    //     // { from: "合肥", to: "厦门" },
    //     // { from: "厦门", to: "深圳" },
    //
    //     // { from: "吉隆坡", to: "香港" },
    //     // { from: "首尔", to: "东京" },
    //     // { from: "洛杉矶", to: "东京" },
    //     // { from: "洛杉矶", to: "悉尼" },
    //
    // ];

    // var locationLists = [
    //     // { name: "合肥", lng_lat: [117.23,31.82], active: 1 },
    //     // { name: "宣城", lng_lat: [118.757995,30.945667], active: 1 },
    //     // { name: "黄山", lng_lat: [118.317325,29.709239], active: 1 },
    //     // { name: "南京", lng_lat: [118.84,32.10], active: 1 },
    //     // { name: "东京", lng_lat: [139.767187, 35.715616], active: 1 },
    //     // { name: "西安", lng_lat: [108.96,34.22], active: 0 },
    //     // { name: "哈尔滨", lng_lat: [116.34,39.92], active: 1 },
    //     // { name: "长沙", lng_lat: [116.07,24.13], active: 1 },
    //     // { name: "西宁", lng_lat: [101.77,36.62], active: 1 },
    //     // { name: "茶卡盐湖", lng_lat: [99.08,36.76], active: 1 },
    //     // { name: "大阪", lng_lat: [135.30,34.40], active: 1 },
    //     // { name: "敦煌", lng_lat: [95.46,40.08], active: 1 },
    //     // { name: "成都", lng_lat: [102.54,32.65], active: 1 },
    //     // { name: "武汉", lng_lat: [114.30943,30.59982], active: 1 },
    //     // { name: "重庆", lng_lat: [106.504962,29.533155], active: 1 },
    //     // {name:"蚌埠", lng_lat:[117.39, 32.92],active: 1},
    //     // {name: "南昌",lng_lat:[115.86, 28.68],  active: 1},
    //     // {name:"扬州", lng_lat:[119.421003, 32.393159], active: 1},
    //     // {name:"上海", lng_lat:[121.472644,31.231706], active: 1},
    //     // {name:"福州", lng_lat:[	119.30384,26.08225], active: 1},
    //     // {name:"厦门", lng_lat:[118.11022,24.490474], active: 1},
    //     // {name:"广州", lng_lat:[113.2442,23.12592], active: 1},
    //     // {name:"深圳", lng_lat:[114.085947,22.547], active: 1},
    //     // {name:"兰州", lng_lat:[103.823557,36.058039], active: 1},
    //
    //
    // ];

    // const series =
    // locationLists.forEach((item) => {
    //     series[item.active ? 2 : 3].data.push({
    //         name: item.name,
    //         value: item.lng_lat,
    //     });
    // });

   const REGEXP_LNG_IAT = "^[0-9.-]+$";
    const [options,setOptions] = useState({
        backgroundColor: "#000",
        globe: {
            baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/world.jpg", // 地球的纹理
            // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
            // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
            shading: "lambert",
            atmosphere: {
                // 不需要大气光圈去掉即可
                show: false,
                offset: 4, // 大气层光圈宽度
            },
            viewControl: {
                distance: 200, // 默认视角距离地球表面距离
            },
            light: {
                ambient: {
                    intensity: 1.3, // 全局的环境光设置
                },
                main: {
                    intensity: 1.5, // 场景主光源设置
                },
            },
        },

    })


    function normalData(data) {
        const res = [];
        data.forEach((dataItem) => {
            const fromCoordItem = locations.find(
                (item) => item.name === dataItem.from
            );
            const toCoordItem = locations.find(
                (item) => item.name === dataItem.to
            );
            if (
                (fromCoordItem && !fromCoordItem.active) ||
                (toCoordItem && !toCoordItem.active)
            ) {
                const fromCoord = fromCoordItem && fromCoordItem.lng_lat;
                const toCoord = toCoordItem && toCoordItem.lng_lat;
                if (fromCoord && toCoord) {
                    res.push([fromCoord, toCoord]);
                }
            }
        });
        return res;
    }

    function activeData(data) {
        const res = [];
        data.forEach((dataItem) => {
            const fromCoordItem = locations.find(
                (item) => item.name === dataItem.from
            );
            const toCoordItem = locations.find(
                (item) => item.name === dataItem.to
            );
            const fromCoord =
                fromCoordItem && fromCoordItem.active && fromCoordItem.lng_lat;
            const toCoord =
                toCoordItem && toCoordItem.active && toCoordItem.lng_lat;
            if (fromCoord && toCoord) {
                res.push([fromCoord, toCoord]);
            }
        });
        return res;
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setValue(e.target.value);
    }

    const dic = {
        "合肥":[117.23,31.82],
        "西安":[108.96,34.22],
        "长沙":[116.07,24.13],
        "大阪":[135.30,34.40],
        "南昌":[115.86, 28.68],
        "北京":[116.40,39.90],
        "上海":[121.47,31.23]
    }

    const data =  useQuery(api.locations.get, {name: value});
    const onClickBadge= (data)=>{

        console.log(value)
        if(locations.map(item=>item.name).includes(value)){
            console.log("loc repeat!")
            return ;
        }

        setLocations([...locations,{
            name: value,
            lng_lat: [data.lng,data.lat], active: 1

        }])
        // 将值设为空
        setValue("")
    }


    useEffect(() => {
       let series = initSeries;
        series[0].data = normalData(lines);
        series[1].data = activeData(lines);
        locations.forEach((item) => {
            series[item.active ? 2 : 3].data.push({
                name: item.name,
                value: item.lng_lat,
            });
        });
        setOptions({
            ...options,
            series: series
        })

    }, [locations,lines]);

    const onUpdateData = (data)=>{
        let updatedLineData = []
        for(let index = 1; index < data.length;index++){
            updatedLineData.push(
                {
                    "from": data[index  -  1],
                    "to": data[index]
                }
            )

        }
        setLines([...lines,...updatedLineData])
        // debugger
    }



    const [lineCollection,setLineCollection] = useState([{}])
    const addLineCollection = () =>{
        setLineCollection([...lineCollection,{}])

    }



    const handleClick = (e,res)=>{
        debugger
        console.log("click triggered!");
        onClickBadge(res)
    }




    return (
    <main className="flex min-h-screen  items-center justify-between ">
        <DndProvider backend={HTML5Backend}>
        <div className = "p-24">
            <span className = "mb-2">
                您去过……
            </span>
            <ul className="flex mt-2">
                {locations?.map((loc) => (
                    <li key = {loc.name}>
                        <Location name={loc.name} />
                    </li>
                ))}
            </ul>
            <div className="flex flex-col w-full max-w-sm items-center space-x-2 mb-4 gap-y-4" >
              <Label>地点：</Label>  <Input placeholder="输入地点" onChange={handleChange} value = {value}/>

                <Label>坐标（经度 -  纬度）：</Label>
                <InputOTP maxLength={12} pattern={REGEXP_LNG_IAT}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                    <InputOTPSlot index={8} />
                    <InputOTPSlot index={9} />
                    <InputOTPSlot index={10} />
                    <InputOTPSlot index={11} />
                </InputOTPGroup>
            </InputOTP>

                {/*提交地点*/}

           </div>

            {data && data.length > 0 && <div className = "flex flex-wrap gap-x-2 gap-y-2" >
               <div> 您可以从下列候选项中选择最接近的坐标点:</div>

                {
                data?.map(res => (
                    <Badge variant="outline" key = {res._id} onClick={event => handleClick(event, res)}>
                        {res.name } [<span className = "text-red-300">{res.lng}</span>,<span className = "text-green-800">{res.lat}</span>]
                    </Badge>
                ))
            }
            </div>
            }


            <span className = "mt-2">
                拖动地点到虚线框内，来形成您的路线图吧！

            </span>

            <div className = "mt-2 flex flex-col ">
                {lineCollection.map((col,index)=>(
                    <>
                        <LineCollection key = {index} updateData={onUpdateData}></LineCollection>
                        {index == lineCollection.length - 1 && <Button variant="ghost"  onClick={addLineCollection}>
                            <Plus></Plus> 新增路线
                        </Button>}
                    </>
                    ))

            }
            </div>

        </div>
        <ReactEcharts
          option={options}
           style={{ width: "900px", height: "900px" }}

      ></ReactEcharts>
        </DndProvider>
    </main>
  );
}