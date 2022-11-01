import { DefaultSession } from "next-auth";
import type { UserProfile } from "@/lib/types/User";

declare module "next-auth/jwt" {

  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      isFinishedSignup: boolean;
    } & User;
  }
}

declare module "next-auth" {

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {

      /**
       * if user have finished setting up their profile
       */
      isFinishedSignup: boolean;
      userName: string;
    } & DefaultSession["user"];
  }

  /**
   * user type return by jwt callback
   */
  interface User {
    userName: string;
    isFinishedSignup: boolean;
  }
}
