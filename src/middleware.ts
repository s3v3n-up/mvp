import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

/**
 * @middleware
 * This is where you can input logic for your middleware
 */

export async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;

    let token = await getToken(
        {
            req,
            secret
        }
    );
    console.log("token", token);
    if (!token) {
        return NextResponse.rewrite(new URL("/login", req.url));
    }

    return NextResponse.next();
}

/**
 * @config This is where you specify the routes, it should be an absolute path
 */


export const config = {
    matcher: ["/api/register"]
};
