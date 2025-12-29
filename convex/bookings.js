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

export const bookEvent = mutation({
  args: {
    eventId: v.id("events"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Check if user is creator
    if (event.userId === user._id) {
      throw new Error("Vous ne pouvez pas vous inscrire à votre propre événement");
    }

    // Check if already booked
    const existingBooking = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    if (existingBooking) {
      throw new Error("Vous êtes déjà inscrit à cet événement");
    }

    // Generate ticket code
    const ticketCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const bookingId = await ctx.db.insert("bookings", {
      userId: user._id,
      eventId: args.eventId,
      ticketCode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { bookingId, ticketCode };
  },
});

export const getUserBookings = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return [];

    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) return [];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const bookingsWithEvents = await Promise.all(
      bookings.map(async (booking) => {
        const event = await ctx.db.get(booking.eventId);
        return {
          ...booking,
          event: event ? {
            ...event,
            imageUrl: event.image ? await ctx.storage.getUrl(event.image) : null,
          } : null,
        };
      })
    );

    return bookingsWithEvents.filter(b => b.event !== null);
  },
});

export const checkBooking = query({
  args: {
    eventId: v.id("events"),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return false;

    const user = await getUserByClerkId(ctx, args.clerkId);
    if (!user) return false;

    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    return !!booking;
  },
});
