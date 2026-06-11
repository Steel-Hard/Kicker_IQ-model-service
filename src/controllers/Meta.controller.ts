import { Request, Response } from "express"
import MetaService from "../services/Meta.service"

class MetaController {
    private readonly metaService: MetaService = new MetaService()

    public getClasses(_: Request, res: Response): void {
        const response = this.metaService.getClassesMetadata()
        res.status(200).json(response)
    }
}

export default MetaController
