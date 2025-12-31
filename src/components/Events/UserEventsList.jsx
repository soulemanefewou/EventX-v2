import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import { Edit2, Trash2, Calendar, Users, DollarSign, Tag } from "lucide-react";

const UserEventsList = ({ onEdit, onViewAttendees }) => {
    const { user } = useUser();
    const events = useQuery(api.events.getUserEvents, { clerkId: user?.id });
    const deleteEvent = useMutation(api.events.deleteEvent);

    if (!events) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Vous n'avez pas encore créé d'événements.</p>
            </div>
        );
    }

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            await deleteEvent({ id, clerkId: user.id });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vos Événements</h2>
            <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                    <div
                        key={event._id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group"
                    >
                        <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                    <Calendar className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onViewAttendees(event)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Voir les participants"
                                        >
                                            <Users className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(event)}
                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(event.date).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-4 h-4" />
                                        {event.category || "Autre"}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                                        <DollarSign className="w-4 h-4" />
                                        {event.price > 0 ? `${event.price} FCFA` : "Gratuit"}
                                    </span>
                                </div>

                                <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserEventsList;
