import { Request, Response } from "express"
import HealthService from "../services/Health.service"

class HealthController {
    private readonly healthService: HealthService = new HealthService()

    public async getModelHealth(_: Request, res: Response): Promise<void> {
        try {
            const response = await this.healthService.getModelHealth()
            const statusCode = response.status === "ok" ? 200 : 503
            res.status(statusCode).json(response)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default HealthController
