import { Router } from "express"
import HealthController from "../controllers/Health.controller"

class HealthRoutes {
    private readonly healthController: HealthController = new HealthController()
    private readonly router: Router = Router()

    private readonly url: string = "/health"

    constructor() {
        this.router.get(
            this.url + "/model",
            this.healthController.getModelHealth.bind(this.healthController)
        )
    }

    public getRouter(): Router {
        return this.router
    }
}

const healthRoutes = new HealthRoutes().getRouter()
export default healthRoutes
