import { AppExpress } from "@expressots/adapter-express";
import {
    Env,
    IMiddleware,
    Middleware,
    ProviderManager,
} from "@expressots/core";
import { container } from "./app.container";
import { DrizzleProvider } from "./db/drizzle/drizzle.provider";

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

        this.middleware.addBodyParser();
        this.middleware.setErrorHandler();
    }

    protected postServerInitialization(): void | Promise<void> {
        if (this.isDevelopment()) {
            this.provider.get(Env).checkAll();
        }
        container.get(DrizzleProvider).Drizzle; //fix
    }

    protected serverShutdown(): void | Promise<void> {
        container.get(DrizzleProvider).closePool;
    }
}
