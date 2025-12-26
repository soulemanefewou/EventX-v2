import { SignedIn, SignedOut, useClerk, UserButton, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react'
import {
  Menu,
  X,
  Calendar,
  Ticket,
  Search,
  Home,
  Heart,
  ShieldCheck,
  Bell
} from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const {user, isLoaded} = useUser();
    const clerk = useClerk();
    const location = useLocation();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === import.meta.env.VITE_ADMIN_EMAIL;

 //Fonction pour vérifier si un lien est actif

 const isActive = (path) => {
    if (path === "/"){
        return location.pathname === "/"
    }
    return location.pathname.startsWith(path);
 }

   const menuItems = [
     { icon: Home, label: "Accueil", href: "/" },
     { icon: Search, label: "Événements", href: "/events" },
   ];

   const handleOpenSignUp = () => {
    clerk.openSignUp();
    setMobileMenuOpen(false)
   };

   const handleOpenSignIn = () => {
    clerk.openSignIn();
    setMobileMenuOpen(false)
   }

   // Classes pour les états actif/inactif
   const activeClasses = "text-emerald-600 bg-emerald-50 font-semibold"
   const inactiveClasses = "text-gray-700 hover:text-emarald-600 hover:bg-emerald-50"

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm sticky top-0 left-0 right-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                  {/* Logo */}
                  <div className="flex items-center gap-8">
                    <Link
                      to="/"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          EventX
                        </span>
                        <span className="text-xs text-emerald-500 font-medium">Live your moments</span>
                      </div>
                    </Link>
      
                    {/* Navigation desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            isActive(item.href) ? activeClasses : inactiveClasses
                          }`}
                        >
                          <item.icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                            isActive(item.href) ? "text-emerald-600" : ""
                          }`} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
      
                      <SignedIn>
                        <Link
                          to="/my-workspace"
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            isActive("/my-workspace") ? activeClasses : inactiveClasses
                          }`}
                        >
                          <Calendar className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                            isActive("/my-workspace") ? "text-emerald-600" : ""
                          }`} />
                          <span className="font-medium">Mon Espace</span>
                        </Link>
                        <Link
                          to="/my-tickets"
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            isActive("/my-tickets") ? activeClasses : inactiveClasses
                          }`}
                        >
                          <Ticket className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                            isActive("/my-tickets") ? "text-emerald-600" : ""
                          }`} />
                          <span className="font-medium">Mes billets</span>
                        </Link>
                        <Link
                          to="/favorites"
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            isActive("/favorites") ? activeClasses : inactiveClasses
                          }`}
                        >
                          <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                            isActive("/favorites") ? "text-emerald-600" : ""
                          }`} />
                          <span className="font-medium">Favoris</span>
                        </Link>
      
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                              isActive("/admin") ? "text-emerald-700 bg-emerald-100 border border-emerald-200" : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                          >
                            <ShieldCheck className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                              isActive("/admin") ? "text-emerald-700" : ""
                            }`} />
                            <span className="font-medium">Admin</span>
                          </Link>
                        )}
                      </SignedIn>
                    </div>
                  </div>
      
                  {/* CTA & User Section */}
                  <div className="flex items-center gap-4">
                    {/* Notifications (authentifié seulement) */}
                    <SignedIn>
                      <button className="hidden lg:block p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      </button>
                    </SignedIn>
      
                    {/* Boutons d'authentification ou User Menu */}
                    <div className="hidden lg:flex items-center gap-3">
                      {!isLoaded ? (
                        <div className="h-10 w-24 bg-emerald-100 rounded-lg animate-pulse"></div>
                      ) : (
                        <>
                          <SignedOut>
                            <button
                              onClick={handleOpenSignIn}
                              className="px-5 py-2.5 text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 rounded-xl transition-all duration-200"
                            >
                              Se connecter
                            </button>
                            <button
                              onClick={handleOpenSignUp}
                              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm hover:shadow-lg flex items-center gap-2"
                            >
                              S'inscrire
                            </button>
                          </SignedOut>
      
                          <SignedIn>
                            <UserButton />
                          </SignedIn>
                        </>
                      )}
                    </div>
      
                    {/* Menu mobile toggle */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      aria-label="Menu"
                    >
                      {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                      ) : (
                        <Menu className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
      
              {/* Menu mobile */}
              {mobileMenuOpen && (
                <div className="lg:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-md animate-slideDown">
                  <div className="px-4 py-6 space-y-2">
                    {/* Navigation mobile avec surbrillance */}
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                          isActive(item.href) ? activeClasses : inactiveClasses
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className={`w-5 h-5 ${
                          isActive(item.href) ? "text-emerald-600" : ""
                        }`} />
                        <span className="font-medium">{item.label}</span>
                        {isActive(item.href) && (
                          <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </Link>
                    ))}
      
                    <SignedIn>
                      <Link
                        to="/my-workspace"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                          isActive("/my-workspace") ? activeClasses : inactiveClasses
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Calendar className={`w-5 h-5 ${
                          isActive("/my-workspace") ? "text-emerald-600" : ""
                        }`} />
                        <span className="font-medium">Mon Espace</span>
                        {isActive("/my-workspace") && (
                          <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </Link>
                      <Link
                        to="/my-tickets"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                          isActive("/my-tickets") ? activeClasses : inactiveClasses
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Ticket className={`w-5 h-5 ${
                          isActive("/my-tickets") ? "text-emerald-600" : ""
                        }`} />
                        <span className="font-medium">Mes billets</span>
                        {isActive("/my-tickets") && (
                          <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </Link>
                      <Link
                        to="/favorites"
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                          isActive("/favorites") ? activeClasses : inactiveClasses
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className={`w-5 h-5 ${
                          isActive("/favorites") ? "text-emerald-600" : ""
                        }`} />
                        <span className="font-medium">Favoris</span>
                        {isActive("/favorites") && (
                          <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </Link>
      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                            isActive("/admin") ? "text-emerald-700 bg-emerald-100 border border-emerald-200" : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ShieldCheck className={`w-5 h-5 ${
                            isActive("/admin") ? "text-emerald-700" : ""
                          }`} />
                          <span className="font-medium">Administration</span>
                          {isActive("/admin") && (
                            <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                          )}
                        </Link>
                      )}
                    </SignedIn>
      
                    {/* Authentification mobile */}
                    <SignedOut>
                      <div className="pt-4 border-t border-emerald-100 space-y-3">
                        <button
                          onClick={handleOpenSignIn}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-emerald-600 font-medium hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-200"
                        >
                          Se connecter
                        </button>
      
                        <button
                          onClick={handleOpenSignUp}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-sm"
                        >
                          S'inscrire gratuitement
                        </button>
                      </div>
                    </SignedOut>
      
                    {/* User Menu mobile */}
                    <SignedIn>
                      <div className="pt-4 border-t border-emerald-100">
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              )}
            </nav>
      
            {/* Espace pour le contenu sous la navbar */}
            <div className="h-16 lg:h-20"></div>
    </>
  )
}

export default NavBar
