import { useState, useEffect } from "react";
import { 
  useUser,
  useClerk,
  useSignIn,
  useSignUp,
  useSession
} from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const clerk = useClerk();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);

  // Login avec email/mot de passe
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        return { success: true };
      } else {
        return { success: false, error: "Échec de la connexion" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.errors?.[0]?.message || "Une erreur est survenue" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Inscription avec email/mot de passe
  const signupWithEmail = async (fullname, email, password) => {
    setLoading(true);
    try {
      const result = await signUp.create({
        firstName: fullname.split(' ')[0],
        lastName: fullname.split(' ').slice(1).join(' ') || "",
        emailAddress: email,
        password,
      });

      // Démarre le processus de vérification d'email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      return { 
        success: true, 
        needsVerification: true,
        email 
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        error: error.errors?.[0]?.message || "Une erreur est survenue" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Vérifier le code d'email
  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        return { success: true };
      }
      return { success: false, error: "Code invalide" };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || "Code invalide" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login avec OAuth (Google, etc.)
  const loginWithOAuth = async (provider = "google") => {
    try {
      await clerk.signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/",
      });
      return { success: true };
    } catch (error) {
      console.error("OAuth error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login avec Google spécifiquement
  const loginWithGoogle = async () => {
    return loginWithOAuth("google");
  };

  // Logout
  const logout = async () => {
    try {
      await clerk.signOut();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      await user.update(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.errors?.[0]?.message || "Erreur de mise à jour" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Récupérer le token JWT
  const getToken = async () => {
    try {
      return await session?.getToken();
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  return {
    // État
    user: {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      firstName: user?.firstName,
      lastName: user?.lastName,
      fullName: user?.fullName,
      imageUrl: user?.imageUrl,
      hasImage: user?.hasImage,
    },
    loading: loading || !isLoaded || !signInLoaded || !signUpLoaded,
    
    // Authentification
    isAuthenticated: isSignedIn,
    loginWithEmail,
    signupWithEmail,
    verifyEmail,
    loginWithGoogle,
    loginWithOAuth,
    logout,
    updateProfile,
    getToken,
    
    // Utilitaires Clerk
    openSignIn: (options) => clerk.openSignIn(options),
    openSignUp: (options) => clerk.openSignUp(options),
    openUserProfile: () => clerk.openUserProfile(),
    
    // Session
    session,
    
    // Accès direct à Clerk pour les cas avancés
    clerk,
  };
};