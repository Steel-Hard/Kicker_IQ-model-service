import { Router } from "express"
import ReportController from "../controllers/Report.controller"

class ReportRoutes {
    private readonly reportController: ReportController = new ReportController()
    private readonly router: Router = Router()

    private readonly url: string = "/reports"

    constructor() {
        this.router.get(
            this.url + "/team-classification.json",
            this.reportController.getTeamClassificationJson.bind(this.reportController)
        )

        this.router.get(
            this.url + "/team-classification.csv",
            this.reportController.getTeamClassificationCsv.bind(this.reportController)
        )
    }

    public getRouter(): Router {
        return this.router
    }
}

const reportRoutes = new ReportRoutes().getRouter()
export default reportRoutes
