// 调用接口

export const getGeoCode = async () => {
    let result = await fetch('https://restapi.amap.com/v3/geocode/geo?',{
        headers: {
            Accept: 'application/vnd.dpexpo.v1+json' //设置请求头
        },
        method: 'get',
    })
    let res = await result.json() //必须通过此方法才可返回数据
    const {data: {data}} = res
    return {
        props: {
            data //props值传导render函数中
        }
    }
}
