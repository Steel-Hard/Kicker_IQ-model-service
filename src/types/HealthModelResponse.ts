type DependencyStatus = {
    status: "up" | "down" | "loaded" | "error"
    latencyMs?: number
    error?: string
}

type HealthModelResponse = {
    status: "ok" | "degraded"
    timestamp: string
    dependencies: {
        db: DependencyStatus
        model: DependencyStatus
        scaler: DependencyStatus
    }
}

export default HealthModelResponse
