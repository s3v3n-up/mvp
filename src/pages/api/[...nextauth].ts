import NextAuth, { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import EmailProvider from 'next-auth/providers/email';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import Database from '@/lib/resources/database';


/**
 * @description
 * This manages the authentication for Passwordless, Google and Discord OAuth
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
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
                    port: Number(process.env.SMTP_PORT),
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
                clientId: process.env.OAUTH_DISCORD_CLIENT_ID,
                clientSecret: process.env.OAUTH_DISCORD_CLIENT_SECRET,
            }
        ),
        /**
         * @description
         * This handles the Google OAuth
         */
        GoogleProvider(
            {
                clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
                clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
            }
        )
    ]
};

export default NextAuth(authOptions);