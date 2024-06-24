import { Response } from "express";

// @provide(SupabaseClientContext)
export interface ISupabaseClientContext {
    reqCookies?: StringDictionary;
    res?: Response;
}
