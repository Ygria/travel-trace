import { v } from "convex/values";
import {defineSchema, defineTable} from "convex/server";


export default defineSchema({
    locations: defineTable({

        // 经纬度
        name: v.string(),
        //  经度
        lng: v.number(),
        // 纬度
        lat:v.number(),


    })
        .index("by_name",["name"])
        .searchIndex("search_by_name",{
            searchField: "name",
            filterFields: ["name"]
        }),
});