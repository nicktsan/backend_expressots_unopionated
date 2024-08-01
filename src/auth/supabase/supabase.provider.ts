import { provide } from "inversify-binding-decorators";
import { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ISupabaseClientContext } from "./supabase.client.context";
import { ENV } from "../../../src/env"

@provide(SupabaseProvider)
export class SupabaseProvider {
  public createSupabaseClient(context: ISupabaseClientContext): SupabaseClient {
    return createServerClient(ENV.SUPABASE.SUPABASE_URL!, ENV.SUPABASE.SUPABASE_PUBLIC_ANON_KEY!, {
      cookies: {
        get: (key) => {
          const cookies = context.reqCookies
          let cookie: string = ''
          if (cookies) {
              cookie = cookies[key] ?? ''
          }
          return decodeURIComponent(cookie)
        },
        set: (key, value, options) => {
          if (!context.res) return
          context.res.cookie(key, encodeURIComponent(value), {
            ...options,
            sameSite: 'Lax',
            httpOnly: true,
          })
        },
        remove: (key, options) => {
          if (!context.res) return
          context.res.cookie(key, '', { ...options, httpOnly: true })
        },
      },
    })
  }
}