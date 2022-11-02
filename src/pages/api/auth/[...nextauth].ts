// Imports NextAuth and NexyAuthOptions from next-auth
import NextAuth, { NextAuthOptions, User } from "next-auth";

// Imports MongoDBAdapter from next-auth/mongodb-adapter
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

// Imports Email, Discord and Google Providers from next-auth
import EmailProvider from "next-auth/providers/email";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

// Imports Database
import Database from "@/lib/resources/database";

import { getUserByEmail } from "@/lib/actions/user";

/**
 * @description
 * This manages the authentication for Passwordless, Google and Discord OAuth
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },

    /**
     * @description
     * Set-up a single mongodb-adapter connection
     */
    adapter: MongoDBAdapter(Database.setupAdapterConnection(process.env.MONGODB_URI)),
    providers: [

        /**
         * @description
         * This handles the passwordless login
         */
        EmailProvider(
            {
                server: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD
                    },
                },
                from: process.env.SMTP_FROM,
            }
        ),

        /**
         * @description
         * This handles the Discord OAuth
         */
        DiscordProvider(
            {
                clientId: process.env.OAUTH_DISCORD_CLIENT_ID!,
                clientSecret: process.env.OAUTH_DISCORD_CLIENT_SECRET!,
            }
        ),

        /**
         * @description
         * This handles the Google OAuth
         */
        GoogleProvider(
            {
                clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
                clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
            }
        )
    ],

    /**
     * @description This handles the callbacks
     */
    callbacks: {

        // Sends back the token
        async jwt({ token, user, account, profile }) {
            if(user) {
                token.user = user as User;
            }
            try {
                if (!token.user.isFinishedSignup) {
                    await Database.setup();
                    const profile = await getUserByEmail(token.user.email!);
                    token.user.isFinishedSignup = true;
                    token.user.profile = profile;
                }

                return token;
            } catch {
                return token;
            }
        },

        // Sends back the session
        async session({ session, token, user }) {
            if(token && token.user) {
                session.user = token.user;
            }

            return session;
        }
    },
    pages: {
        signIn: "/login"
    }
};

// Exports the NextAuth
export default NextAuth(authOptions);