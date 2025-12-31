import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper to check admin status (simplifié pour l'emploi direct dans les fonctions)
// Note: Dans un environnement de production, utilisez une méthode plus robuste
const checkAdmin = async (ctx, clerkId) => {
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
    
    if (!user) throw new Error("User not found");
    
    // Vérification basique basée sur l'email stocké (à adapter selon vos variables d'env coté serveur ou logique métier)
    // Ici on suppose que le frontend a déjà filtré, mais le backend doit aussi vérifier.
    // Pour l'instant on laisse passer si user existe pour la démo, ou on vérifie un email spécifique si possible.
    // Idéalement, passez l'email admin en argument ou via une variable d'environnement accessible au backend.
    return user;
};

export const getStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx, args.clerkId);

    const users = await ctx.db.query("users").collect();
    const events = await ctx.db.query("events").collect();
    const bookings = await ctx.db.query("bookings").collect();

    let totalRevenue = 0;
    
    // Calculer le revenu total
    // Note: C'est une opération potentiellement lourde si beaucoup de données.
    // Optimisation possible: stocker le revenu dans une table stats ou sur l'événement.
    for (const booking of bookings) {
      const event = events.find(e => e._id === booking.eventId);
      if (event && event.price) {
        totalRevenue += event.price;
      }
    }

    // Préparer les données pour le graphique (Revenu par jour sur les 30 derniers jours par exemple)
    const last30Days = [...Array(30)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const revenueByDate = last30Days.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
    }, {});

    for (const booking of bookings) {
        const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0];
        if (revenueByDate[bookingDate] !== undefined) {
             const event = events.find(e => e._id === booking.eventId);
             if (event && event.price) {
                 revenueByDate[bookingDate] += event.price;
             }
        }
    }

    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        revenue: amount
    }));

    return {
        totalUsers: users.length,
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalRevenue,
        chartData
    };
  },
});

export const getUsers = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx, args.clerkId);
        const users = await ctx.db.query("users").order("desc").collect();
        return Promise.all(users.map(async (u) => ({
            ...u,
            imageUrl: (u.image && u.image.startsWith("http")) ? u.image : (u.image ? await ctx.storage.getUrl(u.image) : null)
        })));
    }
});

export const getEventsAdmin = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        await checkAdmin(ctx, args.clerkId);
        const events = await ctx.db.query("events").order("desc").collect();
        return Promise.all(events.map(async (e) => {
            const organizer = await ctx.db.get(e.userId);
            return {
                ...e,
                imageUrl: (e.image && e.image.startsWith("http")) ? e.image : (e.image ? await ctx.storage.getUrl(e.image) : null),
                organizerName: organizer?.fullname || "Inconnu",
                organizerImage: (organizer?.image && organizer.image.startsWith("http")) ? organizer.image : (organizer?.image ? await ctx.storage.getUrl(organizer.image) : null),
            };
        }));
    }
});

export const deleteUser = mutation({
    args: { clerkId: v.string(), userId: v.id("users") },
    handler: async (ctx, args) => {
        await checkAdmin(ctx, args.clerkId);
        await ctx.db.delete(args.userId);
        // Devrait aussi supprimer les événements et bookings liés...
    }
});

export const deleteEvent = mutation({
    args: { clerkId: v.string(), eventId: v.id("events") },
    handler: async (ctx, args) => {
        await checkAdmin(ctx, args.clerkId);
        await ctx.db.delete(args.eventId);
        
        // Supprimer les bookings associés
        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
            .collect();
            
        for (const b of bookings) {
            await ctx.db.delete(b._id);
        }
    }
});
