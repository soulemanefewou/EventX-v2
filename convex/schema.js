import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Ticket } from "lucide-react";


export default defineSchema({
    users: defineTable({
        clerkId: v.optional(v.string()),// ID de l'utilisateur dans Clerk
        fullname: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        password: v.string(), // pour compatibilité avec ancien système
        createdAt: v.number(),
        updateAt: v.number(),
    })
    .index("by_email", ["email"])
    .index("by_clerk_id", ["clerkId"]),

    events: defineTable({
        userId: v.id("users"),
        title: v.string(),
        description: v.optional(v.string()),
        date: v.string(),
        location: v.optional(v.string()),
        price: v.optional(v.number()),
        category: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
        image: v.optional(v.string()),
    }),

    bookings: defineTable({
        userId: v.id("users"),
        eventId: v.id("events"),
        createAt: v.number(),
        updateAt: v.number(),
        ticketCode: v.string(),
    })
    .index("by_userId", ["userId"])
    .index("by_eventId", ["eventId"])
    .index("by_ticketCode", ["ticketCode"])
    
})