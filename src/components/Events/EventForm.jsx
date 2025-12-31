import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import ImageUpload from "./ImageUpload";
import { Loader2, Calendar, Type, AlignLeft, DollarSign, Tag, MapPin } from "lucide-react";

const CATEGORIES = [
    "Conférence",
    "Concert",
    "Sport",
    "Art & Culture",
    "Atelier",
    "Soirée",
    "Autre"
];

const EventForm = ({ eventToEdit = null, onSuccess }) => {
    const { user } = useUser();
    const createEvent = useMutation(api.events.createEvent);
    const updateEvent = useMutation(api.events.updateEvent);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        price: "",
        category: "Autre",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (eventToEdit) {
            setFormData({
                title: eventToEdit.title,
                description: eventToEdit.description || "",
                date: eventToEdit.date || "",
                location: eventToEdit.location || "",
                price: eventToEdit.price || 0,
                category: eventToEdit.category || "Autre",
                image: eventToEdit.imageUrl || eventToEdit.image || null,
            });
        }
    }, [eventToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("Vous devez être connecté pour créer un événement.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            let imageToSave = formData.image;
            if (eventToEdit && formData.image === eventToEdit.imageUrl) {
                imageToSave = eventToEdit.image;
            }

            const eventData = {
                clerkId: user.id,
                title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                price: Number(formData.price) || 0,
                category: formData.category,
                image: imageToSave || undefined,
            };

            if (eventToEdit) {
                await updateEvent({
                    id: eventToEdit._id,
                    ...eventData,
                });
            } else {
                await createEvent(eventData);
            }

            if (!eventToEdit) {
                setFormData({
                    title: "",
                    description: "",
                    date: "",
                    location: "",
                    price: "",
                    category: "Autre",
                    image: null,
                });
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                    {eventToEdit ? "Modifier l'événement" : "Créer un événement"}
                </h2>
                <p className="text-gray-500">
                    Remplissez les informations ci-dessous pour publier votre événement.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Type className="w-4 h-4 text-emerald-500" />
                        Titre de l'événement
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        placeholder="Ex: Conférence Tech 2024"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            Date et Heure
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Lieu
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            placeholder="Ex: Palais des Congrès, Paris"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-500" />
                            Catégorie
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        Prix (FCFA)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        placeholder="0 pour Gratuit"
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">Laissez vide ou 0 pour un événement gratuit.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-emerald-500" />
                        Description
                    </label>
                    <textarea
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                        placeholder="Décrivez votre événement..."
                    />
                </div>

                <ImageUpload
                    image={formData.image}
                    setImage={(img) => setFormData({ ...formData, image: img })}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement en cours...
                    </>
                ) : (
                    eventToEdit ? "Mettre à jour l'événement" : "Créer l'événement"
                )}
            </button>
        </form>
    );
};

export default EventForm;
