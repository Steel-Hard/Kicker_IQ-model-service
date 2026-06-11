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

        this.router.get(
            this.url + "/:id/profile-timeline",
            this.athleteController.getProfileTimeline.bind(this.athleteController)
        )

        this.router.get(
            this.url + "/:id/profile-summary",
            this.athleteController.getProfileSummary.bind(this.athleteController)
        )
    }

    public getRouter() {
        return this.router
    }
}

const athleteRoutes = new AthleteRoutes().getRouter()
export default athleteRoutes