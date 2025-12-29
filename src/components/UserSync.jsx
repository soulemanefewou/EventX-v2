import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const UserSync = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        const sync = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    await syncUser({
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName || user.username || "User",
                        image: user.imageUrl,
                    });
                } catch (err) {
                    console.error("Failed to sync user:", err);
                }
            }
        };

        sync();
    }, [isLoaded, isSignedIn, user, syncUser]);

    return null;
};

export default UserSync;
