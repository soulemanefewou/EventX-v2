import { useNavigate } from "react-router-dom";
import { Calendar, Users, Star, Clock, PlusCircle, Ticket } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-8 mb-12">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Contenu texte */}
        <div className="lg:w-1/2">
          {/* Badge d'accueil chaleureux */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full font-medium mb-6 border border-green-100">
            <Ticket className="w-4 h-4" />
            <span>Bienvenue dans notre communauté d'événements</span>
          </div>

          {/* Titre principal avec effet plus humain */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block">Rencontrez, partagez,</span>
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              vivez ensemble
            </span>
            <span className="block">des moments uniques</span>
          </h1>

          {/* Description personnalisée */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Rejoignez une communauté passionnée qui donne vie à des expériences mémorables. 
            Que vous soyez participant ou organisateur, trouvez votre prochaine aventure.
          </p>

          {/* Appel à l'action convivial */}
          <div className="flex flex-wrap gap-4 items-center mb-10">
            <button 
              className="group px-7 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/my-workspace")}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Lancer mon événement</span>
            </button>
            
            <button 
              className="px-6 py-3.5 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-medium flex items-center gap-2"
              onClick={() => navigate("/events")}
            >
              <Calendar className="w-5 h-5" />
              <span>Explorer les événements</span>
            </button>
          </div>

          {/* Statistiques communautaires avec icônes */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold">+10,000 membres</p>
                <p className="text-sm text-gray-500">Communauté active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold">4.8/5</p>
                <p className="text-sm text-gray-500">Satisfaction</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Support 24/7</p>
                <p className="text-sm text-gray-500">Toujours là pour vous</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image à droite */}
        <div className="lg:w-1/2 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="img.jpg" 
              alt="Communauté d'événements heureux" 
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            
            {/* Overlay subtil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
          </div>
          
          {/* Éléments décoratifs subtils */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-100 rounded-full opacity-20"></div>
        </div>
      </div>
    </section>
  );
};