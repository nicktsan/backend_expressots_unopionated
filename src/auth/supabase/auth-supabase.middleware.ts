import { NextFunction, Request, Response } from "express";
import { SupabaseProvider } from "./supabase.provider";
import { SupabaseClient } from "@supabase/supabase-js";
import { ISupabaseClientContext } from "./supabase.client.context";
import { container } from "../../app.container";

function getToken(req: Request): string | undefined {
    if (req.headers.authorization) {
        const authHeaderSplit = req.headers.authorization.split(" ");
        if (authHeaderSplit.length > 1 && authHeaderSplit[0] === "Bearer") {
            return authHeaderSplit[1];
        }
    }
    return undefined;
}

//Denies access to the route if the user is unauthorized.
export async function AuthSupabaseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const supabaseProvider: SupabaseProvider = container.get(SupabaseProvider);
    const token = getToken(req);
    if (!token) {
        res.status(401).json({ error: "No authorization token." });
        return;
    }
    const context: ISupabaseClientContext = {
        reqCookies: req.cookies,
        res: res,
    };
    const supabase: SupabaseClient =
        supabaseProvider.createSupabaseClient(context);
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        if (error) throw error;

        req.headers["userid"] = user?.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
}

//Fetches authorized user if the token is valid. If the token is invalid, there will be no userid header in the request
//and this request will be treated as a guest request with limited access to certain data and features.
export async function getUserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const supabaseProvider: SupabaseProvider = container.get(SupabaseProvider);
    const token = getToken(req);
    if (!token) {
        //If no auth token, the user is a guest and has limited access.
        return next();
    }
    const context: ISupabaseClientContext = {
        reqCookies: req.cookies,
        res: res,
    };
    const supabase: SupabaseClient =
        supabaseProvider.createSupabaseClient(context);
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser(token);
        if (user) {
            req.headers["userid"] = user?.id;
        }
        next();
    } catch (error) {
        console.log("error in getUserMiddleware: ", error);
        res.status(401).json(error);
    }
}
