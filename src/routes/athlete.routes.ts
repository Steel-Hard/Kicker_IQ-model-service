import { Router } from "express";
import AthleteController from "../controllers/Athlete.controller";

class AthleteRoutes {
    private athleteController: AthleteController = new AthleteController()
    private router: Router = Router()

    private url: string = "/athlete"

    constructor() {
        this.router.get(
            this.url + "/metrics",
            this.athleteController.getMetrics.bind(this.athleteController)
        )
    }

    public getRouter() {
        return this.router
    }
}

const athleteRoutes = new AthleteRoutes().getRouter()
export default athleteRoutes