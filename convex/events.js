import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper to get user by Clerk ID
async function getUserByClerkId(ctx, clerkId) {
  if (!clerkId) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createEvent = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    location: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) throw new Error("User not found");

    const eventId = await ctx.db.insert("events", {
      userId: user._id,
      title: args.title,
      description: args.description,
      date: args.date,
      location: args.location,
      price: args.price,
      category: args.category,
      image: args.image,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return eventId;
  },
});

export const updateEvent = mutation({
  args: {
    clerkId: v.string(),
    id: v.id("events"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    location: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    if (event.userId !== user._id) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      date: args.date,
      location: args.location,
      price: args.price,
      category: args.category,
      image: args.image,
      updatedAt: Date.now(),
    });
  },
});

export const deleteEvent = mutation({
  args: {
    clerkId: v.string(),
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    if (event.userId !== user._id) throw new Error("Unauthorized");

    // Delete associated bookings
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.id))
      .collect();
    
    for (const booking of bookings) {
      await ctx.db.delete(booking._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getUserEvents = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return [];

    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) return [];

    const events = await ctx.db
      .query("events")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      events.map(async (event) => ({
        ...event,
        imageUrl: event.image ? await ctx.storage.getUrl(event.image) : null,
      }))
    );
  },
});

// Public query to get all events for homepage
export const getEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .order("desc")
      .collect();

    return await Promise.all(
      events.map(async (event) => ({
        ...event,
        imageUrl: event.image ? await ctx.storage.getUrl(event.image) : null,
      }))
    );
  },
});

// Get attendees for a specific event
export const getEventAttendees = query({
  args: {
    eventId: v.id("events"),
    clerkId: v.string(), // To ensure only the creator can view attendees
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) return []; // Or throw error

    const event = await ctx.db.get(args.eventId);
    if (!event) return [];
    
    // Only creator can view attendees
    if (event.userId !== user._id) return [];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();

    const attendees = await Promise.all(
      bookings.map(async (booking) => {
        const attendee = await ctx.db.get(booking.userId);
        return {
          ...attendee,
          ticketCode: booking.ticketCode,
          bookingDate: booking.createdAt,
        };
      })
    );

    return attendees.filter(a => a !== null);
  },
});
