import React from 'react'
import EventsGrid from '../components/Events/EventsGrid'

const EventPages = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Tous les événements</h1>
        <p className="text-gray-600">Découvrez tous nos événements à venir et réservez vos places.</p>
      </div>
      <EventsGrid/>
    </div>
  )
}

export default EventPages
