import { NextFunction, Request, Response } from "express";
import { SupabaseProvider } from "./supabase.provider";
import { SupabaseClient } from "@supabase/supabase-js";
import { ISupabaseClientContext } from "./supabase.client.context"

function getToken(req: Request): string | undefined {
    if (req.headers.authorization) {
        const authHeaderSplit = req.headers.authorization.split(' ')
        if (authHeaderSplit.length > 1 && authHeaderSplit[0] === 'Bearer') {
            return authHeaderSplit[1];
        }
    }
    return undefined
}

//Denies access to the route if the user is unauthorized.
export async function AuthSupabaseMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const supabaseProvider: SupabaseProvider = new SupabaseProvider()
    // let token: string | null = null;
    // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //     token = req.headers.authorization.split(' ')[1];
    // }
    const token = getToken(req);
    if (!token) {
        res.status(401).json({ error: 'No authorization token.' });
        return;
    }
    const context: ISupabaseClientContext = {
        reqCookies: req.cookies,
        res: res,
    }
    const supabase: SupabaseClient = supabaseProvider.createSupabaseClient(context);
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
    
        if (error) throw error;
    
        req.headers["userid"] = user?.id
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

//Fetches authorized user if the token is valid. If the token is invalid, there will be no userid header in the request.
//todo ask for best practices to avoid Error: Cannot set headers after they are sent to the client
export async function getUserMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const supabaseProvider: SupabaseProvider = new SupabaseProvider()
    // let token: string | undefined = undefined;
    // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //     token = req.headers.authorization.split(' ')[1];
    // }
    const token = getToken(req);
    if (!token) {
        // console.log("no authorization header")
        // req.headers["userid"] = ""
        // next("no authorization header");
        next();
    }
    const context: ISupabaseClientContext = {
        reqCookies: req.cookies,
        res: res,
    }
    const supabase: SupabaseClient = supabaseProvider.createSupabaseClient(context);
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
    
        // if (error) throw error;
        // req.headers["userid"] = ""
        if (user) {
            req.headers["userid"] = user?.id
        }
        next();
    } catch (error) {
        console.log("error in getUserMiddleware: ", error)
        res.status(401).json(error);
    }
}