import { 
  Ticket, 
  Search, 
  PlusCircle, 
  Calendar,
  MapPin,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  // Exemple : détection admin (à remplacer par votre logique réelle)
  const isAdmin = false; // Remplacez par votre logique d'authentification

  const quickActions = [
    {
      id: 1,
      title: "Mes Tickets",
      description: "Voir mes réservations",
      icon: <Ticket className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-100",
      hover: "hover:bg-green-100 hover:border-green-200",
      link: "/my-bookings",
      admin: false
    },
    {
      id: 2,
      title: "Rechercher",
      description: "Trouver des événements",
      icon: <Search className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100",
      hover: "hover:bg-emerald-100 hover:border-emerald-200",
      link: "/events",
      admin: false
    },
    {
      id: 3,
      title: "Événements à venir",
      description: "Agenda",
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      color: "bg-green-50 border-green-100",
      hover: "hover:bg-green-100 hover:border-green-200",
      link: "#calendar",
      admin: false
    },
    {
      id: 4,
      title: "Près de chez vous",
      description: "Localisation",
      icon: <MapPin className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 border-emerald-100",
      hover: "hover:bg-emerald-100 hover:border-emerald-200",
      link: "#nearby",
      admin: false
    },
    {
      id: 5,
      title: "Tendances",
      description: "Événements populaires",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-100",
      hover: "hover:bg-green-100 hover:border-green-200",
      link: "#trending",
      admin: false
    },
    {
      id: 6,
      title: "Créer un événement",
      description: "Organisateur",
      icon: <PlusCircle className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-r from-green-600 to-emerald-500 border-transparent",
      hover: "hover:from-green-700 hover:to-emerald-600 hover:shadow-lg",
      textColor: "text-white",
      link: "/create-event",
      admin: true,
      badge: "Admin"
    }
  ];

  return (
    <section className="my-10">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Accès rapide</h2>
      </div>
      
      {/* Grille d'actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions
          .filter(action => !action.admin || (action.admin && isAdmin))
          .map((action) => (
            <Link
              key={action.id}
              to={action.link}
              className={`group relative p-5 rounded-xl border-2 transition-all duration-300 ${action.color} ${action.hover} ${action.textColor || 'text-gray-800'} flex flex-col items-start shadow-sm hover:shadow-md`}
            >
              {/* Badge Admin */}
              {action.badge && (
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  {action.badge}
                </span>
              )}
              
              {/* Icone */}
              <div className="mb-3 p-2 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                {action.icon}
              </div>
              
              {/* Contenu texte */}
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-green-700 transition-colors">
                  {action.title}
                </h3>
                <p className={`text-sm ${action.textColor ? 'text-green-100' : 'text-gray-600'}`}>
                  {action.description}
                </p>
              </div>
              
              {/* Indicateur de clic */}
              <div className="mt-4 flex items-center text-sm font-medium">
                <span className={`${action.textColor ? 'text-green-200' : 'text-green-600'}`}>
                  Accéder
                </span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 ${action.textColor ? 'text-green-200' : 'text-green-600'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
      </div>
      
      {/* Ligne de séparation */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <p className="text-center text-gray-500 text-sm">
          Naviguez rapidement entre les fonctionnalités principales
        </p>
      </div>
    </section>
  );
};