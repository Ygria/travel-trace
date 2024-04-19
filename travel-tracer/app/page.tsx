import Image from "next/image";
"use client"
import * as echarts from "echarts"
import 'echarts-gl';
import { useRef } from "react";
import ReactEcharts from "echarts-for-react"
export default function Home() {

    var locationLists = [
        { name: "合肥", lng_lat: [117.23,31.82], active: 1 },
        { name: "宣城", lng_lat: [118.757995,30.945667], active: 1 },
        { name: "黄山", lng_lat: [118.317325,29.709239], active: 1 },
        { name: "南京", lng_lat: [118.84,32.10], active: 1 },
        { name: "东京", lng_lat: [139.767187, 35.715616], active: 1 },
        { name: "西安", lng_lat: [108.96,34.22], active: 0 },
        { name: "哈尔滨", lng_lat: [116.34,39.92], active: 1 },
        { name: "长沙", lng_lat: [116.07,24.13], active: 1 },
        { name: "西宁", lng_lat: [101.77,36.62], active: 1 },
        { name: "茶卡盐湖", lng_lat: [99.08,36.76], active: 1 },
        { name: "大阪", lng_lat: [135.30,34.40], active: 1 },
        { name: "敦煌", lng_lat: [95.46,40.08], active: 1 },
        { name: "成都", lng_lat: [102.54,32.65], active: 1 },
        { name: "武汉", lng_lat: [114.30943,30.59982], active: 1 },
        { name: "重庆", lng_lat: [106.504962,29.533155], active: 1 },
        {name:"蚌埠", lng_lat:[117.39, 32.92],active: 1},
        {name: "南昌",lng_lat:[115.86, 28.68],  active: 1},
        {name:"扬州", lng_lat:[119.421003, 32.393159], active: 1},
        {name:"上海", lng_lat:[121.472644,31.231706], active: 1},
        {name:"福州", lng_lat:[	119.30384,26.08225], active: 1},
        {name:"厦门", lng_lat:[118.11022,24.490474], active: 1},
        {name:"广州", lng_lat:[113.2442,23.12592], active: 1},
        {name:"深圳", lng_lat:[114.085947,22.547], active: 1},
        {name:"兰州", lng_lat:[103.823557,36.058039], active: 1},


    ];
    var linesData = [
        { from: "合肥", to: "南京" },
        { from: "合肥", to: "黄山" },
        { from: "宣城", to: "合肥" },
        { from: "南京", to: "武汉" },
        { from: "南京", to: "上海" },
        { from: "合肥", to: "蚌埠" },
        { from: "合肥", to: "南昌" },
        { from: "合肥", to: "成都" },
        { from: "成都", to: "重庆" },
        { from: "南京", to: "东京" },
        { from: "东京", to: "大阪" },
        { from: "合肥", to: "哈尔滨" },
        { from: "合肥", to: "长沙" },
        { from: "合肥", to: "西宁" },
        { from: "西宁", to: "茶卡盐湖" },
        { from: "茶卡盐湖", to: "敦煌" },
        { from: "敦煌", to: "兰州" },
        { from: "合肥", to: "深圳" },
        { from: "合肥", to: "广州" },
        { from: "合肥", to: "福州" },
        { from: "合肥", to: "厦门" },
        { from: "厦门", to: "深圳" },

        // { from: "吉隆坡", to: "香港" },
        // { from: "首尔", to: "东京" },
        // { from: "洛杉矶", to: "东京" },
        // { from: "洛杉矶", to: "悉尼" },

    ];

    function normalData(data) {
        const res = [];
        data.forEach((dataItem) => {
            const fromCoordItem = locationLists.find(
                (item) => item.name === dataItem.from
            );
            const toCoordItem = locationLists.find(
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
            const fromCoordItem = locationLists.find(
                (item) => item.name === dataItem.from
            );
            const toCoordItem = locationLists.find(
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



    const  series = [
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
            data: activeData(linesData) /*
            起点经纬度 终点经纬度
            [
              [[fromx0,fromy0],[tox0,toy0]],
              [[fromx1,fromy1],[tox1,toy1]]
            ]
            */,
        },
        {
            type: "lines3D",
            lineStyle: {
                color: "#fff",
                width: 2,
                opacity: 0.6,
            },
            data: normalData(linesData),
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
            /*
              [
                {
                  name: '',
                  value: [lng,lat]
                }
              ]
              */
        },
    ];
    locationLists.forEach((item) => {
        series[item.active ? 2 : 3].data.push({
            name: item.name,
            value: item.lng_lat,
        });
    });
    const chartDom = useRef()
    // const myecharts = echarts.init(chartDom.current);
    const options = {
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
        series: series,
    };
    // myecharts.setOption(option);

    const options2 = {
        grid: { top: 20, right: 40, bottom: 20, left: 40 },
        xAxis: {
            type: "category",
            data: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                data: [400, 300, 350, 200, 280],
                type: "bar",
                smooth: true
            }
        ],
        tooltip: {
            trigger: "axis"
        }
    }



  return (
    <main className="flex min-h-screen  items-center justify-between ">
        <div className = "p-24">
            定义你的旅游路线：

        </div>
        <ReactEcharts
          option={options}
           style={{ width: "900px", height: "900px" }}
      ></ReactEcharts>
    </main>
  );
}
