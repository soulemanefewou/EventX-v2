import React from 'react'
import { api } from '../../../convex/_generated/api'
import { Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import EventCard from './EventCard';

const EventsGrid = () => {
    const events = useQuery(api.getEvents);

    if(!events){
        return(
            <div className='flex justify-center py-12'>
                <Loader2 className='w-8 h-8 text-emerald-500 animate-spin'/>
            </div>
        )
    }

    if (events.length === 0){
        return(
            <div className="text-center py-12 text-gray-500">
                Aucun événement disponible pour le moment.
            </div>
        )
    }


  return (
    <section>
        <div className="grid grid-cols-1 sm:grid-cold-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard key={event._id} event={event}/>
            ))}
        </div>
    </section>
  )
}

export default EventsGrid
