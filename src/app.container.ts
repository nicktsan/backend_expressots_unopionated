import { AppContainer } from "@expressots/core";
import { AppModule } from "./app.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DeckModule } from "./deck/deck.module";
import { DeckslotModule } from "./deckslot/deckslot.module";
import { CardModule } from "./card/card.module";

export const appContainer: AppContainer = new AppContainer({
    autoBindInjectable: false,
});

export const container = appContainer.create([
    // Add your modules here
    AppModule,
    AuthModule,
    UserModule,
    DeckModule,
    DeckslotModule,
    CardModule,
]);
