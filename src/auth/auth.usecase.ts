import { provide } from "inversify-binding-decorators";

@provide(AuthUsecase)
export class AuthUsecase {
    execute() {
        return "Hello from AuthUsecase!";
    }
}
