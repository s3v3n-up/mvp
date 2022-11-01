import { UserProfile } from "@/lib/types/User";
import { createContext, ReactNode, useMemo } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import axios from "axios";

/**
 * type of profile context
 */
interface ContextProfile {
    currProfile: UserProfile | null;
    setCurrProfile: (user: UserProfile | null) => void;
}

/**
 * profile context
 */
export const ProfileContext = createContext<ContextProfile | null>(null);

/**
 * Component to provide the current user profile to pages
 */
export default function ProfileProvider ({ children }: {children: ReactNode}) {
    const { data: session } = useSession();
    const [currProfile, setCurrProfile] = useLocalStorage<UserProfile | null>("currMVPProfile", null);

    //fetch user profile
    useMemo(async () => {
        if (session && session.user.isFinishedSignup && !currProfile) {
            const { data } = await axios.get(`/api/user/${session.user.userName}`);
            setCurrProfile(data);
        }
    }, [session, currProfile, setCurrProfile]);

    return (
        <ProfileContext.Provider value={{ currProfile, setCurrProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}