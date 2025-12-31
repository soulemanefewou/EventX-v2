import React from 'react'
import AdminDashboard from '../components/admin/AdminDashboard'

const AdminPage = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Tableau de bord administrateur</h1>
        <p className='text-gray-600 mb-8'>Gérez les événements, utilisateurs et statistiques</p>
        <AdminDashboard/>
    </div>
  )
}

export default AdminPage
