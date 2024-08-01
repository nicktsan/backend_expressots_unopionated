import { Response } from "express";
import { StringDictionary } from "../../stringDictionary";

export interface ISupabaseClientContext {
    reqCookies?: StringDictionary;
    res?: Response;
}
