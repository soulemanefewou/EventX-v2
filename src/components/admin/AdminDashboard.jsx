import  { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Calendar, DollarSign, Activity, Ticket, TrendingUp, TrendingDown,
  Search, Filter, DownloadCloud, Eye, Edit, Trash2, UserPlus, PlusCircle,
  Clock, Sparkles, Shield, Award, Target, RefreshCw, Settings, CheckCircle,
  X, MapPin, Tag, ArrowUpRight
} from 'lucide-react';
import { MetricBadge } from './MetricBadge';
import { StatCard } from './StatCard';
import { EventDetailModal } from './EventDetailModal';

const AdminDashboard = () => {

    const { user } = useUser()
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsloading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    //Queries
    const stats = useQuery(api.admin.getStats, {clerkId: user?.id})
    const usersList = useQuery(api.admin.getUsers, {clerkId: user?.id})
    const eventList = useQuery(api.admin.getEventsAdmin, {clerkId: user?.id})


    //Mutation
    const deleteUser = useMutation(api.admin.deleteUser)
    const deleteEvent = useMutation(api.admin.deleteEvent)
    //Note: Assuming a refresh logic exists or simulate it
    const refreshStats = ()=> setIsloading(true)
        
    //Simulating refresh
    useEffect(() => {
        if(isLoading) setTimeout(() => setIsloading(false), 800)
    }, [isLoading])

    const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'XAF', minimumFractionDigits:0}).format(amount)

    //Filtering
    const filteredUsers = usersList?.filter(u =>
        u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || []
    )  
   
       const filteredEvents = eventList?.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizerName?.toLowerCase().includes(searchQuery.toLowerCase()) || []
    )  
    
    const handleDeleteUser = async (userId, name) =>{
        if (window.confirm(`Supprimer l'utilisateur ${name} ?`)){
            await deleteUser({clerkId: user.id, userId})
        }
    }

    const handleDeleteEvent = async (EventsGrid, title, e) =>{
        e.stopPropagation()
        if(window.confirm(`Supprimer l'événement ${title} ?`)){
            await deleteEvent({clerkId:user.id, eventId})
        }
    };

    //Chart mock data if not available

      const chartData = stats?.chartData || [];
  const categoryData = [
    { name: 'Musique', value: 35, color: '#10b981' },
    { name: 'Conférence', value: 25, color: '#059669' },
    { name: 'Sport', value: 20, color: '#047857' },
    { name: 'Art', value: 15, color: '#065f46' },
    { name: 'Autre', value: 5, color: '#064e3b' }
  ];

  if (!stats) return <div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
          <div className="space-y-8 animate-fadeIn p-2 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-600" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-2">Bienvenue, <span className="font-semibold text-gray-900">{user?.fullName}</span>. Voici ce qui se passe aujourd'hui.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={refreshStats} className={`p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all ${isLoading ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5">
                  <DownloadCloud className="w-4 h-4" />
                  Exporter Rapport
                </button>
              </div>
            </div>
      
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto pb-1 gap-6 scrollbar-hide">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                { id: 'users', label: 'Utilisateurs', icon: Users },
                { id: 'events', label: 'Événements', icon: Calendar },
                { id: 'settings', label: 'Paramètres', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-colors whitespace-nowrap font-medium text-sm ${isActive ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
      
            {/* Content Areas */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="flex flex-wrap gap-4">
                  <MetricBadge label="Conversion" value="3.2%" icon={Target} />
                  <MetricBadge label="Satisfaction" value="4.8/5" icon={Award} />
                  <MetricBadge label="Evenements actifs" value={stats.totalEvents} icon={Sparkles} />
                  <MetricBadge label="Ticket moyen" value={formatCurrency(15000)} icon={DollarSign} />
                </div>
      
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Revenu Total" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} color="emerald" change={12.5} subtext="Revenu global cumulé" />
                  <StatCard title="Utilisateurs" value={stats.totalUsers} icon={Users} color="blue" change={8.1} subtext="Utilisateurs inscrits" />
                  <StatCard title="Événements" value={stats.totalEvents} icon={Calendar} color="purple" change={5.3} subtext="Tous les événements" />
                  <StatCard title="Réservations" value={stats.totalBookings} icon={Ticket} color="amber" change={-2.4} subtext="Billets vendus" />
                </div>
      
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-900">Analyse des revenus</h3>
                      <select className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg p-2 cursor-pointer outline-none">
                        <option>30 derniers jours</option>
                        <option>7 derniers jours</option>
                      </select>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={str => new Date(str).getDate()}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={val => `${val / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={val => [formatCurrency(val), 'Revenu']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
      
                  {/* Categories Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Catégories populaires</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                      {categoryData.map(cat => (
                        <div key={cat.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            <span className="text-gray-600">{cat.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
      
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-bold text-lg text-gray-900">Utilisateurs inscrits</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm w-full md:w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Utilisateur</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(userItem => (
                        <tr key={userItem._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                {userItem.imageUrl ? (
                                  <img src={userItem.imageUrl} alt={userItem.fullname} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-200">
                                    {userItem.fullname?.[0] || 'U'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{userItem.fullname || "Inconnu"}</p>
                                <p className="text-xs text-gray-400">ID: {userItem._id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{userItem.email}</td>
                          <td className="px-6 py-4 text-gray-600">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(userItem._id, userItem.fullname)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
      
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-bold text-lg text-gray-900">Événements publiés</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm w-full md:w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Événement</th>
                        <th className="px-6 py-4">Lieu</th>
                        <th className="px-6 py-4">Organisateur</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEvents.map(evt => (
                        <tr
                          key={evt._id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedEvent(evt)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                {evt.imageUrl ? (
                                  <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                                    <Calendar className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">{evt.title}</p>
                                <p className="text-xs text-emerald-600 font-medium">{evt.price > 0 ? formatCurrency(evt.price) : 'Gratuit'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[150px]">{evt.location || "En ligne"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                {evt.organizerImage ? (
                                  <img src={evt.organizerImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                                    {evt.organizerName?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="text-gray-600 text-xs">{evt.organizerName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${new Date(evt.date) > new Date()
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                              }`}>
                              {new Date(evt.date) > new Date() ? 'À venir' : 'Terminé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                              <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteEvent(evt._id, evt.title, e)}
                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
      
            {selectedEvent && (
              <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
          </div>
    </div>
  )
}

export default AdminDashboard
