import { v } from "convex/values";
import { query } from "./_generated/server"

export const get = query({
    args:{
        // orgId: v.string(),
        // search: v.optional(v.string()),
        // favorites: v.optional(v.string())
        name: v.string()
    },
    handler: async (ctx,args) => {

        let locations = [];

        locations = await ctx.db.query("locations")
            .withSearchIndex("search_by_name", (q) =>
            q.search("name", args.name)).take(10);


        return locations;
    }
})