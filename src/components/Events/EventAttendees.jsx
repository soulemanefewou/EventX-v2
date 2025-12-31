import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import { User, Calendar, Mail } from "lucide-react";

const EventAttendees = ({ eventId }) => {
    const { user } = useUser();
    const attendees = useQuery(api.events.getEventAttendees, {
        eventId,
        clerkId: user?.id
    });

    if (!attendees) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (attendees.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">Aucun participant inscrit pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                Participants ({attendees.length})
            </h3>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white overflow-hidden">
                {attendees.map((attendee) => (
                    <div key={attendee._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {attendee.image ? (
                                <img src={attendee.image} alt={attendee.fullname} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                    {attendee.fullname?.charAt(0) || "U"}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-900">{attendee.fullname}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {attendee.email}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md font-medium mb-1">
                                {attendee.ticketCode}
                            </span>
                            <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(attendee.bookingDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventAttendees;
