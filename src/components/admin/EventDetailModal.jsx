import { Calendar, Clock, MapPin, X } from "lucide-react";

export const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
        <div className="relative h-48 sm:h-64 bg-gray-100">
          <img
            src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur text-emerald-700 text-xs font-bold rounded-full shadow-sm">
              {event.category || "Autre"}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${new Date(event.date) > new Date() ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-white'
              }`}>
              {new Date(event.date) > new Date() ? 'À venir' : 'Terminé'}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium">{new Date(event.date).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Heure</p>
                <p className="font-medium">{new Date(event.date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit', minute: '2-digit'
                })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Lieu</p>
                <p className="font-medium">{event.location || "Non défini"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                {event.organizerImage ? (
                  <img src={event.organizerImage} alt="Org" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold">
                    {event.organizerName?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400">Organisé par</p>
                <p className="text-sm font-bold text-gray-900">{event.organizerName}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-xs text-gray-400">Prix</p>
              <p className="text-lg font-bold text-emerald-600">
                {event.price > 0 ? `${event.price.toLocaleString()} FCFA` : 'Gratuit'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {event.description || "Aucune description fournie."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};