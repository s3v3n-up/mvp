// Import Response & Request
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import getToken function to grabe the token from jwt
import { getToken } from "next-auth/jwt";

/**
 * @middleware
 * This is where you can input logic for your middleware
 */
export async function middleware(req: NextRequest) {

    // Pass the secret from process.env into secret variable
    const secret = process.env.NEXTAUTH_SECRET;

    // Pass the token into a token variable
    const token = await getToken({ req, secret });

    // If there is no token meaning no session, redirect to login page
    if (!token) {
        if (req.nextUrl.pathname !== "/login") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return;
    }

    // If user is not finished signing up then redirect to register page
    if (!token.user.isFinishedSignup) {
        return NextResponse.redirect(new URL("/register", req.url));
    }
}

/**
 * @config This is where you specify the routes, it should be an absolute path
 */
export const config = {
    matcher: ["/", "/api/match/:path*", "/match/:path*", "/api/sport/:path*", "/user/:path*", "/leaderboard/:path*", "/create/:path*"]
};
