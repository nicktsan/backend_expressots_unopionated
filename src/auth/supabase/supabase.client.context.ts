import { Response } from "express";
import { StringDictionary } from "../../stringDictionary";

// @provide(SupabaseClientContext)
export interface ISupabaseClientContext {
    reqCookies?: StringDictionary;
    res?: Response;
}
