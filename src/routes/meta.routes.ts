import { Router } from "express"
import MetaController from "../controllers/Meta.controller"

class MetaRoutes {
    private readonly metaController: MetaController = new MetaController()
    private readonly router: Router = Router()

    private readonly url: string = "/meta"

    constructor() {
        this.router.get(
            this.url + "/classes",
            this.metaController.getClasses.bind(this.metaController)
        )
    }

    public getRouter(): Router {
        return this.router
    }
}

const metaRoutes = new MetaRoutes().getRouter()
export default metaRoutes
