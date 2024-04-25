"use client"

import 'echarts-gl';

import {Location } from "./components/location"


import {Plus,Shirt,WandSparkles} from "lucide-react"
import {ChangeEvent, useEffect, useRef, useState} from "react"

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
import {useLocationPoints} from "@/app/store/use-location-points";
import { ScrollArea } from "@/components/ui/scroll-area"
import {useLineCollections} from "@/app/store/use-line-collections";


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

    const lines = useLineCollections(s=>s.lineCollections).map(item=>{
        let ret = [];

        for(let index = 1; index < item.locIds?.length;index++){
            ret.push(
                {
                    "from":  item.locIds[index  -  1],
                    "to":  item.locIds[index]
                }
            )

        }
        return ret
    })


    const [value,setValue] = useState("");

    const {locations,addLocation,removeLocation} = useLocationPoints();

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
                (item) => item.id === dataItem.from
            );
            const toCoordItem = locations.find(
                (item) => item.id === dataItem.to
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
        debugger
        const res = [];
        data.forEach((arr) => {
            arr.forEach(dataItem=>{
                const fromCoordItem = locations.find(
                    (item) => item.id === dataItem.from.id
                );
                const toCoordItem = locations.find(
                    (item) => item.id === dataItem.to.id
                );

                const fromCoord =
                    fromCoordItem && fromCoordItem.lng && fromCoordItem.lat;
                const toCoord =
                    toCoordItem && toCoordItem.lng && toCoordItem.lat;
                if (fromCoord && toCoord) {
                    res.push([[fromCoordItem.lng,fromCoordItem?.lat],
                        [toCoordItem.lng,toCoordItem?.lat]]);
                }
            })

        });
        return res;
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        setValue(e.target.value);
    }



    const handleRemove = (e,loc)=> {
        //  todo  update lines！

        removeLocation(loc.id)

        // debugger
    }



    const [customTheme,setCustomTheme] = useState({})

    const onSelectTheme = (data) =>{
        setCustomTheme(data)
    }



    const {lineCollections,addLineCollection} = useLineCollections()

    useEffect(() => {
       let series = initSeries;
        series[0].data = normalData(lines);
        series[1].data = activeData(lines);
        locations.forEach((item) => {
            series[2].data.push({
                name: item.name,
                value: [item.lng,item.lat]
            });
        });
        setOptions({
            ...options,
            ...customTheme,
            series: series
        })

    }, [locations,lineCollections,customTheme]);




    // const [lineCollection,setLineCollection] = useState([{}])

    // const addLineCollection = () =>{
    //     setLineCollection([...lineCollection,{}])
    //
    // }



    return (
    <main className="flex items-center justify-between ">


        <EditLocation />
        <DndProvider backend={HTML5Backend}>
        <div className = "max-w-1/2 h-screen relative p-12 box-border ">
            <Theme onSelect = {onSelectTheme}/>

            <AddLocation/>
            <ScrollArea className="h-[200px] w-[600px] rounded-md  p-4 pr-12  whitespace-nowrap ">

                {locations?.map((loc,index) => (


                        <Location key = {loc.id} id = {loc.id} name={loc.name} onRemove={e => handleRemove(e, loc)} lng={loc.lng} lat={loc.lat} />

                ))}

            </ScrollArea>
            <span className = "mt-2">
                拖动地点到虚线框内，来形成您的路线图吧！

            </span>

            <ScrollArea className="h-[400px] w-[600px] rounded-md  p-4 pr-12">
                {lineCollections.map((col,index)=>(
                    <>
                        {index == 0 &&
                            <Button variant="ghost"  onClick={addLineCollection} key={`${index}_button`}>
                                <Plus></Plus> 新增路线
                            </Button>
                        }
                        <LineCollection id = {col.id}></LineCollection>

                    </>
                    ))

            }
            </ScrollArea>

        </div>

            <ScrollArea className="flex shrink-1 h-screen">
            <ReactEcharts
                option={options}
                style={{ width: "900px", height: "800px" }}

            ></ReactEcharts>
            </ScrollArea>

        </DndProvider>
    </main>
  );
}