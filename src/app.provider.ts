import { AppExpress } from "@expressots/adapter-express";
import {
    Env,
    IMiddleware,
    Middleware,
    ProviderManager,
} from "@expressots/core";
import { ENV } from "./env"
import { appContainer, container } from "./app.container";
import { DrizzleProvider } from "./db/drizzle/drizzle.provider";
import cors from "cors";

export class App extends AppExpress {
    private middleware: IMiddleware;
    private provider: ProviderManager;

    constructor() {
        super();
        this.middleware = container.get<IMiddleware>(Middleware);
        this.provider = container.get(ProviderManager);
    }

    protected configureServices(): void | Promise<void> {
        this.provider.register(Env);
        // this.setEngine(Engine.HBS);
        // this.middleware.addMiddleware({ path: "some regex that excludes src/auth/supabase/confirmSignup, maybe something like this ^\/(?!signup).*$", middlewares:[cors({ origin: ENV.CORS.FRONTEND_ORIGIN })] }); //path can use regex to situationally apply global middleware
        // this.middleware.addMiddleware({ path: "some regex that only includes src/auth/supabase/confirmSignup", middlewares:[cors({ origin: "*" })] }); //path can use regex to situationally apply global middleware

        this.middleware.addBodyParser();
        this.middleware.setErrorHandler();
    }

    protected postServerInitialization(): void | Promise<void> {
        if (this.isDevelopment()) {
            this.provider.get(Env).checkAll();
        }
        // container.get(DrizzleProvider).Drizzle; //fix
        appContainer.viewContainerBindings();
    }

    protected serverShutdown(): void | Promise<void> {
        container.get(DrizzleProvider).closePool;
    }
}
