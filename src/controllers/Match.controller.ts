import { Request, Response } from "express";
import ModelService from "../services/Model.service";
import PlayerMetricsInput from "../types/PlayerMetrics";
import AppError from "../errors/AppError";
import sendControllerError from "../utils/controllerError";

class MatchController {
    private modelService: ModelService = new ModelService()
    private readonly maxBatchSize = 200

    /**
     * `POST | http://0.0.0.0:0000/match/predict`
     */
    public async matchPredict(req: Request<Record<string, never>, unknown, PlayerMetricsInput>, res: Response): Promise<void> {
        try {
            const match = req.body

            const modelResult = await this.modelService.predict(match)
            const result = this.modelService.interpretResult(modelResult)

            res.status(200).json(result)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }

    public async batchPredict(req: Request, res: Response): Promise<void> {
        try {
            const athletes = (req.body as { athletes?: Array<{ athleteId?: number; metrics: PlayerMetricsInput }> }).athletes

            if (!Array.isArray(athletes)) {
                throw new AppError("athletes must be an array", 400, "VALIDATION_ERROR")
            }

            if (athletes.length === 0) {
                throw new AppError("athletes must contain at least one item", 400, "VALIDATION_ERROR")
            }

            if (athletes.length > this.maxBatchSize) {
                throw new AppError(
                    `athletes exceeds max batch size (${this.maxBatchSize})`,
                    400,
                    "BATCH_LIMIT_EXCEEDED"
                )
            }

            const results: Array<{
                index: number
                athleteId?: number
                status: "success" | "error"
                prediction?: unknown
                error?: string
            }> = []

            for (let index = 0; index < athletes.length; index += 1) {
                const item = athletes[index]
                try {
                    const modelResult = await this.modelService.predict(item.metrics)
                    const prediction = this.modelService.interpretResult(modelResult)
                    results.push({
                        index,
                        athleteId: item.athleteId,
                        status: "success",
                        prediction,
                    })
                } catch (error: unknown) {
                    results.push({
                        index,
                        athleteId: item.athleteId,
                        status: "error",
                        error: error instanceof Error ? error.message : "prediction failed",
                    })
                }
            }

            const successCount = results.filter((item) => item.status === "success").length
            const failureCount = results.length - successCount

            res.status(200).json({
                total: results.length,
                successCount,
                failureCount,
                results,
            })
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }
}

export default MatchController