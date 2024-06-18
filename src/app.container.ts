import { AppContainer } from "@expressots/core";
import { AppModule } from "./app.module";
import { AuthModule } from "./auth/auth.module";

export const appContainer: AppContainer = new AppContainer({
    autoBindInjectable: false,
});

export const container = appContainer.create([
    // Add your modules here
    AppModule,
    AuthModule,
]);
