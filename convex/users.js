import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const syncUser = mutation({
    args:{
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
    },
    handler: async(ctx, args) => {
        // Verifier si l'utilisateur existe déjà par Clerk ID
        const existingUserByClerkId = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .unique();

        if(existingUserByClerkId){
            //Mettre à jour l'utilisateur existant
            return await ctx.db.patch(existingUserByClerkId._id, {
                email: args.email,
                fullname: args.name,
                image: args.image || existingUserByClerkId.image,
                updatedAt: Date.now(),
            });
        }

        // Vérifier si l'utilisateur existe déjà par email (pour migration)
        const existingUserByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique()

        if(existingUserByEmail){
            // Mettre à jour l'utilisateur existant avec le clerk ID
            return await ctx.db.patch(existingUserByEmail._id, {
                clerkId: args.clerkId,
                fullname: args.name || existingUserByEmail.fullname,
                image: args.image || existingUserByEmail.image,
                updatedAt: Date.now()
            });
        }

        //Creer un nouvel utlisateur avec Clerk
        return await ctx.db.insert("users", {
            clerkId: args.clerkId,
            fullname: args.name,
            email: args.email,
            image: args.image || null,
            password: "clerk_auth", // Mot de passe placeholder pour Clerk
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Mettre à jour l'utilisateur
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(user._id, {
      email: args.email || user.email,
      fullname: args.name || user.fullname,
      image: args.image || user.image,
      updatedAt: Date.now(),
    });
  },
});

// Supprimer l'utilisateur
export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Supprimer les événements de l'utilisateur
    const userEvents = await ctx.db
      .query("events")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const event of userEvents) {
      // Supprimer les réservations associées à cet événement
      const eventBookings = await ctx.db
        .query("bookings")
        .withIndex("by_eventId", (q) => q.eq("eventId", event._id))
        .collect();
      
      for (const booking of eventBookings) {
        await ctx.db.delete(booking._id);
      }
      
      await ctx.db.delete(event._id);
    }

    // Supprimer les réservations de l'utilisateur
    const userBookings = await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const booking of userBookings) {
      await ctx.db.delete(booking._id);
    }

    // Supprimer l'utilisateur
    await ctx.db.delete(user._id);
    
    return { success: true };
  },
});

// Récupérer un utilisateur par Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Récupérer un utilisateur par email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Fonction de compatibilité pour récupérer ou créer un utilisateur
export const getOrCreateUser = query({
  args: {
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId && !args.email) {
      return null;
    }

    let user = null;
    
    // Chercher par clerkId d'abord
    if (args.clerkId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .unique();
    }
    
    // Si pas trouvé, chercher par email
    if (!user && args.email) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();
    }

    // Si l'utilisateur existe, le retourner
    if (user) {
      // Si l'utilisateur n'a pas de Clerk ID mais qu'on en a un, le mettre à jour
      if (!user.clerkId && args.clerkId) {
        await ctx.db.patch(user._id, {
          clerkId: args.clerkId,
          updatedAt: Date.now(),
        });
        user.clerkId = args.clerkId;
      }
      return user;
    }

    // Si on a les infos nécessaires, créer un nouvel utilisateur
    if (args.clerkId && args.email) {
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        fullname: args.name || args.email.split('@')[0],
        image: args.image || null,
        password: "clerk_auth",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      return await ctx.db.get(userId);
    }

    return null;
  },
});

// Fonctions de compatibilité pour l'ancien système (si nécessaire)
export const createUserLegacy = mutation({
  args: {
    fullname: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("Un compte avec cet email existe déjà");
    }

    const userId = await ctx.db.insert("users", {
      fullname: args.fullname,
      email: args.email,
      password: args.password,
      clerkId: null, // Pas de Clerk ID pour les anciens utilisateurs
      image: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      id: userId,
      fullname: args.fullname,
      email: args.email,
      createdAt: Date.now(),
    };
  },
});

export const loginUserLegacy = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      return null;
    }

    if (user.password !== args.password) {
      return null;
    }

    return {
      id: user._id,
      clerkId: user.clerkId,
      fullname: user.fullname,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    };
  },
});

// Récupérer tous les utilisateurs
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});