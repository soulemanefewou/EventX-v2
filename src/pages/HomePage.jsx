import { Hero } from "../components/Hero";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import { useState, useMemo } from "react";
import { QuickActions } from "../components/QuickAction";

const CATEGORIES = [
  "Tout",
  "Conférence",
  "Concert",
  "Sport",
  "Art & Culture",
  "Atelier",
  "Soirée",
  "Autre"
];

const HomePage = () => {
  const events = useQuery(api.events.getEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "Tout" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);
  return (
    <div className="min-h-screen bg-gray-50">
    
          <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
    
            {/* HERO / WELCOME */}
            <Hero />
    
            {/* QUICK ACTIONS */}
            <QuickActions />
          </div>
        </div>
  )
}

export default HomePage
