import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { Ticket, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

const MyTicketsPage = () => {
    const { user } = useUser();
    const bookings = useQuery(api.bookings.getUserBookings, { clerkId: user?.id });

    if (!bookings) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Ticket className="w-8 h-8 text-emerald-500" />
                        Mes Billets
                    </h1>
                    <p className="mt-2 text-gray-600">Retrouvez ici tous vos billets pour les événements à venir.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun billet</h3>
                        <p className="text-gray-500 mb-6">Vous n'avez pas encore réservé d'événements.</p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                        >
                            Découvrir les événements
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row">
                                {/* Event Image */}
                                <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                                    <img
                                        src={booking.event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"}
                                        alt={booking.event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600">
                                        {booking.event.category || "Événement"}
                                    </div>
                                </div>

                                {/* Ticket Details */}
                                <div className="flex-1 p-6 flex flex-col justify-between relative">
                                    {/* Perforated line effect (visual) */}
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 w-6 h-6 bg-gray-50 rounded-full hidden md:block"></div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 w-6 h-6 bg-gray-50 rounded-full hidden md:block"></div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.event.title}</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-emerald-500" />
                                                <span>{new Date(booking.event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-emerald-500" />
                                                <span>{new Date(booking.event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Code Billet</p>
                                            <p className="text-lg font-mono font-bold text-gray-800 tracking-widest">{booking.ticketCode}</p>
                                        </div>
                                        <div className="p-2 rounded-lg">
                                            <QRCode 
                                                value={booking.eventId} 
                                                size={80}
                                                bgColor="white"
                                                fgColor="black"
                                                level="L" // Niveau de correction d'erreur
                                                className="border-2 border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTicketsPage;