"use client"
import Image from "next/image";

import * as echarts from "echarts"
import {Location } from "./components/location"

import 'echarts-gl';


import {Plus,Shirt,WandSparkles} from "lucide-react"
import { Input } from "@/components/ui/input"
import {ChangeEvent, useEffect, useState} from "react"

import ReactEcharts from "echarts-for-react"
import {Button} from "@/components/ui/button";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {LineCollection} from "@/app/components/line-collection";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api"

import {AddLocation} from "./components/add-location"
import {EditLocation} from "@/app/components/edit-location";
import {Theme} from "@/app/components/theme";


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

    const REGEXP_LNG_IAT = "^[0-9.-]+$";
    const [options,setOptions] = useState({
        backgroundColor: "#000",
        globe: {
            // baseTexture:"https://cdn.jsdelivr.net/gh/Ygria/Pictures@main/world.jpg", // 地球的纹理
            // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
            // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
            baseTexture:"/earth1.jpg",
            shading: "lambert",
            atmosphere: {
                // 不需要大气光圈去掉即
                show: false,
                offset: 4, // 大气层光圈宽度
            },
            viewControl: {
                distance: 200, // 默认视角距离地球表面距离
            },
            light: {
                ambient: {
                    intensity: 1, // 全局的环境光设置
                },
                main: {
                    intensity: 1, // 场景主光源设置
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

    const data =  useQuery(api.locations.get, {name: value});
    const onClickBadge= (data)=>{
        console.log(data.name)
        if(locations.map(item=>item.name).includes(data.name)){
            console.log("loc repeat!")
            return ;
        }

        setLocations([...locations,{
            name: data.name,
            lng_lat: [data.lng,data.lat], active: 1
        }])

    }

    const handleRemove = (e,loc)=> {
        //  todo  update lines！
        setLocations(locations.filter(item=>item !== loc))

        // debugger
    }



    const [customTheme,setCustomTheme] = useState({})

    const onSelectTheme = (data) =>{
        setCustomTheme(data)
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
            ...customTheme,
            series: series
        })

    }, [locations,lines,customTheme]);

    const onUpdateData = (colIndex,data)=>{

        let updatedLineData = []
        for(let index = 1; index < data?.length;index++){
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

        console.log("click triggered!");
        onClickBadge(res)
    }

    const onEditLocation = (index: number,name: string,lng: string,lat: string) =>{
        const nextLocations = locations.map((c, i) => {
            if (i === index) {
                // 递增被点击的计数器数值
                return{
                    name: name,
                    lng_lat: [Number(lng),Number(lat)],
                    active: 1
                }
            } else {
                // 其余部分不发生变化
                return c;
            }
        });

        setLocations(nextLocations)

    }






    return (
    <main className="flex min-h-screen  items-center justify-between ">


        <EditLocation   onConfirm={onEditLocation}/>
        <DndProvider backend={HTML5Backend}>
        <div className = "p-24 max-w-900px relative">
            <Theme onSelect = {onSelectTheme}/>

            <span className = "mb-2">
                您去过……
            </span>
            <AddLocation onAdd = {onClickBadge}/>

            <ul className="flex mt-2">
                {locations?.map((loc,index) => (
                    <li key = {`${index}_${loc.name}`}>
                        <Location index = {index} name={loc.name} onRemove={e => handleRemove(e, loc)} lng={loc.lng_lat[0]} lat={loc.lng_lat[1]}
                                  onEdit={function (): void {
                                      throw new Error("Function not implemented.");
                                  }}/>
                    </li>
                ))}
            </ul>
            <span className = "mt-2">
                拖动地点到虚线框内，来形成您的路线图吧！

            </span>

            <div className = "mt-2 flex flex-col" key = "line-collections">
                {lineCollection.map((col,index)=>(
                    <>
                        <LineCollection _key = {`${index}_collection`} updateData={data=>onUpdateData(index,data)}></LineCollection>
                        {index == lineCollection.length - 1 &&
                       <Button variant="ghost"  onClick={addLineCollection} key={`${index}_button`}>
                            <Plus></Plus> 新增路线
                        </Button>
                        }
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