import { controller, Get, response } from "@expressots/adapter-express";
import { Response } from "express";

@controller("/")
export class AppController {
    @Get("/")
    execute(@response() res: Response) {
        // return "Hello from ExpressoTS!";
        res.render("index", { message: "Nicholas Tsang", date: new Date() });
    }
    @Get("execute2")
    execute2(@response() res: Response) {
        // return "Hello from ExpressoTS!";
        res.render("index2", { user: "nicktsang2" });
    }
}
