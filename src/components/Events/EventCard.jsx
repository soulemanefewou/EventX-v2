import { Clock, MapPin } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const EventCard = ({event, small = false}) => {

    //Format date
    const eventDate = new Date(event.date)
    const dateStr = eventDate.toLocaleDateString('fr-Fr', {day: 'numeric', month:'short'});
    const yearStr = event.getFullYear()
    const timeStr = event.toLocaleDateString('fr-Fr', {hour: '2-digit', minute:'2-digit'})
  return (
    <Link
        to={`/events/${event._id}`}
        className='group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-cool h-full border-transparent hover:border-emerald-100'
    >
    {/*Image Container*/}
    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/*Price Badge*/}
        <div className="absolute bottom-3 bg-white/95 backdrop:blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-baseline gap-1">
            {(!event.price || event.price === 0) ? (
                <span className='text-emerald-600 font-bold text-sm'>Gratuit</span>
            ): (
                <>
                <span className='text-gray-900 font-bold'>{event.price}</span>
                <span className='text-gray-500 text-xs font-medium'>FCFA</span>
                </>
            )}
        </div>

        {/*Category Badge*/}
        {event.category && (
            <div className='absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full'>
                {event.category}
            </div> 
        )}
    </div>
    <div className='p-5 flex flex-col flex-1'>
        <div className="flex gap-4 mb-3">
            {/*Date Box*/}
            <div className='flex flex-col items-center justify-center bg-emerald-50 rounded-xl w-12 h-12 flex-shrink-0 text-emerald-700'>
                <span className='text-xs font-bold uppercase'>{eventDate.toLocaleString('fr-FR', {month: 'short'})}</span>
                <span className='text-lg font-bold leading-none'>{eventDate.getDate()}</span>
            </div>

            {/*Titre*/}
            <div>
                <h3 className='font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2'>
                    {event.title}
                </h3>
                <p className='text-sm text-gray-500 mt-1 flex items-center gap-1'>
                    <Clock className='w-3 h-3'/>
                    {timeStr}
                </p>
                {event.location && (
                    <p className='text-sm text-gray-500 mt-1 flex items-center gap-1'>
                        <MapPin className='w-3 h-3'/>
                        {event.location}
                    </p>
                )}
            </div>
        </div>
    </div>

    {/* Description (Optional) */}
    {!small && event.description && (
        <p className='text-gray-600 text-sm mb-4 line-clamp-2 flex-1 pl-[4rem]'>
            {event.description}
        </p>
    )}

    {/*Footer*/}

    <div className='mt-auto pt-4 border-t border-gray-50 flex items-center justify-between pl-[4rem]'>
        <div className='flex items-center gap-2'>
            {/*Avatar placeholder*/}
            <div className='w-6 h-6 rounded-full bg-gray-200'></div>
            <span className='text-xs text-gray-500 font-medium'>EventX</span>
        </div>
    </div>
    </Link>
  )
}

export default EventCard
