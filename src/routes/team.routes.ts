import { Router } from "express"
import TeamController from "../controllers/Team.controller"

class TeamRoutes {
    private readonly teamController: TeamController = new TeamController()
    private readonly router: Router = Router()

    private readonly url: string = "/team"

    constructor() {
        this.router.get(
            this.url + "/classification",
            this.teamController.getClassification.bind(this.teamController)
        )

        this.router.get(
            this.url + "/trends",
            this.teamController.getTrends.bind(this.teamController)
        )
    }

    public getRouter(): Router {
        return this.router
    }
}

const teamRoutes = new TeamRoutes().getRouter()
export default teamRoutes
