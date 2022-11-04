import { UserProfile } from "@/lib/types/User";
import { createContext, ReactNode, useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";

/**
 * type of profile context
 */
interface ContextAvatar {
    currAvatar: string | null;
    setCurrAvatar: (user: UserProfile | null) => void;
}

/**
 * profile context
 */
export const AvatarContext = createContext<ContextAvatar | null>(null);

/**
 * Component to provide the current user profile to pages
 */
export default function AvatarProvider ({ children }: {children: ReactNode}) {
    const { data: session } = useSession();
    const [isAvatarLoaded, setIsAvatarLoaded] = useState<boolean>(false);
    const [currAvatar, setCurrAvatar] = useLocalStorage<string | null>("currAvatar", null);

    //fetch user profile and set it's image as current avatar
    useMemo(async () => {
        if (session && session.user.isFinishedSignup && !currAvatar && !isAvatarLoaded) {
            const { data } = await axios.get(`/api/user/${session.user.userName}`);
            setCurrAvatar(data.image);
            setIsAvatarLoaded(true);
        }
    }, [session, currAvatar, isAvatarLoaded, setCurrAvatar]);

    return (
        <AvatarContext.Provider value={{ currAvatar, setCurrAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
}