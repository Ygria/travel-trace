// 调用接口


interface GaodeRes {
    formatted_address: string,
    location: string
}


export const getGeoCode = async (address: string) : Promise<GaodeRes[]> => {
    let result = await fetch(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=7a7d4e15075b691a4cd4265b7f88de06`,{
        headers: {
            Accept: 'application/vnd.dpexpo.v1+json' //设置请求头
        },
        method: 'get',
    })
    let res = await result.json() //必须通过此方法才可返回数据
    return res.geocodes;
}

