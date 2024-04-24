import {WandSparkles} from "lucide-react";


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useState} from "react";



interface ThemeTopic {
    // name: "蓝色星球",
    // value: "earth.jpg"
    name: string,
    texture: string
}

interface ThemeProps {
    onSelect: ({}) => {}
}

export const Theme = ({onSelect}: ThemeProps)=>{


    const [theme,setTheme] = useState("0");

    const themeTopics  = [{
        backgroundColor: "#000",
        globe: {
            // baseTexture:"https://cdn.jsdelivr.net/gh/Ygria/Pictures@main/world.jpg", // 地球的纹理
            // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
            // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
            baseTexture: "/earth1.jpg",
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
                    intensity: 0.8, // 全局的环境光设置
                },
                main: {
                    intensity: 1, // 场景主光源设置
                },
            },
        },
    },
        {
            backgroundColor: "#000",
            globe: {
                // baseTexture:"https://cdn.jsdelivr.net/gh/Ygria/Pictures@main/world.jpg", // 地球的纹理
                // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
                // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
                baseTexture: "/earth2.jpg",
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
        },
        {
            backgroundColor: "#000",
            globe: {
                // baseTexture:"https://cdn.jsdelivr.net/gh/Ygria/Pictures@main/world.jpg", // 地球的纹理
                // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
                // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
                baseTexture: "/earth3.jpg",
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
                        intensity: 1.3, // 全局的环境光设置
                    },
                    main: {
                        intensity: 1.5, // 场景主光源设置
                    },
                },
            },
        },
        {
            backgroundColor: "#000",
            globe: {
                // baseTexture:"https://cdn.jsdelivr.net/gh/Ygria/Pictures@main/world.jpg", // 地球的纹理
                // baseTexture:"https://raw.githubusercontent.com/Ygria/Pictures/main/2261234821.jpg", // 地球的纹理
                // baseTexture:"https://pictures-1315245396.cos.ap-nanjing.myqcloud.com/2261234821.jpg", // 地球的纹理
                baseTexture: "/earth4.jpg",
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
                        intensity: 1.3, // 全局的环境光设置
                    },
                    main: {
                        intensity: 1.5, // 场景主光源设置
                    },
                },
            },
        }
    ]

    const selectTheme = (value)=>{
        setTheme(value)
        onSelect(themeTopics[value])
    }


    return <>
        <div  className = "absolute right-2 top-2">

        <Select  onValueChange={selectTheme} defaultValue={theme}>
            <SelectTrigger className="w-[120px]">
                <WandSparkles></WandSparkles>
                <SelectValue placeholder="选择主题" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="0">自然</SelectItem>
                    <SelectItem value="1">蓝星</SelectItem>
                    <SelectItem value="2">星光</SelectItem>
                    <SelectItem value="3">黑白</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        </div>
    </>
}