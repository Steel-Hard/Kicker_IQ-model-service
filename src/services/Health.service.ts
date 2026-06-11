import db from "../db"
import ModelService from "./Model.service"
import HealthModelResponse from "../types/HealthModelResponse"

class HealthService {
    private readonly modelService: ModelService = new ModelService()

    public async getModelHealth(): Promise<HealthModelResponse> {
        const startedAt = Date.now()

        let dbStatus: HealthModelResponse["dependencies"]["db"] = {
            status: "down",
        }

        try {
            await db.query("SELECT 1")
            dbStatus = {
                status: "up",
                latencyMs: Date.now() - startedAt,
            }
        } catch (error: unknown) {
            dbStatus = {
                status: "down",
                error: error instanceof Error ? error.message : "db query failed",
            }
        }

        const modelReadiness = await this.modelService.checkReadiness()

        const modelStatus: HealthModelResponse["dependencies"]["model"] = {
            status: modelReadiness.model,
        }

        const scalerStatus: HealthModelResponse["dependencies"]["scaler"] = {
            status: modelReadiness.scaler,
        }

        if (modelReadiness.model === "error") {
            modelStatus.error = modelReadiness.errors.join(" | ")
        }

        if (modelReadiness.scaler === "error") {
            scalerStatus.error = modelReadiness.errors.join(" | ")
        }

        const status =
            dbStatus.status === "up" &&
            modelStatus.status === "loaded" &&
            scalerStatus.status === "loaded"
                ? "ok"
                : "degraded"

        return {
            status,
            timestamp: new Date().toISOString(),
            dependencies: {
                db: dbStatus,
                model: modelStatus,
                scaler: scalerStatus,
            },
        }
    }
}

export default HealthService
