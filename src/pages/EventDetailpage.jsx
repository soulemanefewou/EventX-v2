import { useClerk } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../convex/_generated/api';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Loader2, MapPin, Share2, Tag, Ticket } from 'lucide-react';

const EventDetailpage = () => {
    const {id} = useParams()
    const navigate = useNavigate();
    const {user, openSignIn} = useClerk()
    const clerk = useClerk()

    const events = useQuery(api.events.getEvents);
    const event = events?.find(e => e._id === id)

    const bookEvent = useMutation(api.bookings.bookEvent)
    const isbooked = useQuery(api.bookings.checkBooking, {eventId:id, clerkId: user?.id})

    const [bookingLoading, setBookingLoading] = useState(false)

    if(!events){
        return(
            <div className='min-h-screen flex items-center justify-center bg-white'>
                <Loader2 className='w-10 h-10 text-emerald-500 animate-spin'/>
            </div>
        );
    }
    if(!event){
        return(
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Evènement introuvable</h2>
                <button
                    onClick={() => navigate('/')}
                    className='px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors'
                >
                    Retour à l'accueil
                </button>
            </div>
        )
    }

    const handleBooking = async () => {
        //Si l'utilisateur n'est pas connecté, ouvrir la modal de connexion

        if(!user){
            return
        }

        //Si l'utilisateur est déjà inscrit, ne rien faire
        if(isbooked){
            return
        }

        //Sinon, proceder a la reservation
        setBookingLoading(true);
        try{
            await bookEvent({eventId: id, clerkId:user.id});
            //Rediriger vers la page des tickets apres reservation
            navigate("/my-tickets")
        }
        catch(error){
            console.error("Erreur de réservation:", error);
            // Vous pouvez remplacer alert par composant toast
            alert(error.message || "Une erreur est survenue lors de la réservation")
        }finally{
            setBookingLoading(false)
        }
    }

    // Format date
    const eventDate = new Date(event.date)
    const dateStr = eventDate.toLocaleDateString('fr-Fr', {weekday:'long', day: 'numeric', month: 'long', year:'numeric'})
    const timeStr = eventDate.toDateString('fr-Fr', {hour: '2-digit', minute: '2-digit'})
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-6 pb-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
    
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT COLUMN: Main Content */}
              <div className="lg:col-span-2 space-y-6">
    
                {/* Hero Image / Video Placeholder */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-sm relative group">
                  <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
    
                {/* Title & Primary Info */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="capitalize">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{timeStr}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{event.category || "Autre"}</span>
                    </div>
                  </div>
                </div>
    
                {/* Organizer / Channel Info */}
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                      {/* Placeholder for organizer avatar */}
                      E
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Organisateur</h3>
                      <p className="text-xs text-gray-500">EventX Official</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                    S'abonner
                  </button>
                </div>
    
                {/* Description */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">À propos</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description || "Aucune description fournie pour cet événement."}
                  </p>
                </div>
    
              </div>
    
              {/* RIGHT COLUMN: Sidebar / Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
    
                  {/* Booking Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 font-medium mb-1">Prix du billet</p>
                      <div className="flex items-baseline gap-1">
                        {event.price > 0 ? (
                          <>
                            <span className="text-3xl font-bold text-gray-900">{event.price}</span>
                            <span className="text-gray-500 font-medium">FCFA</span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-emerald-600">Gratuit</span>
                        )}
                      </div>
                    </div>
    
                    {/* Bouton de réservation unique qui gère les trois états */}
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading || (user && isBooked)}
                      className={`w-full py-3 font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                        user && isBooked
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : user && isBooked ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Déjà inscrit
                        </>
                      ) : user ? (
                        <>
                          <Ticket className="w-5 h-5" />
                          Réserver ma place
                        </>
                      ) : (
                        <>
                          <Ticket className="w-5 h-5" />
                          Réserver ma place
                        </>
                      )}
                    </button>
    
                    <p className="text-xs text-center text-gray-400 mt-4">
                      {user 
                        ? "Accès immédiat à votre billet après inscription." 
                        : "Connectez-vous pour réserver votre place."}
                    </p>
                  </div>
    
                  {/* Share / Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </button>
                    <button
                      onClick={() => navigate(-1)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Retour
                    </button>
                  </div>
    
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default EventDetailpage
