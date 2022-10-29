import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {

  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {

    user: {
        isFinishedSignup: boolean;
    } & User
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
    } & DefaultSession["user"]
  }

  interface User {
    isFinishedSignup: boolean;
  }
}