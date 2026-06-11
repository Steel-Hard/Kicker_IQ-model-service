import * as ort from 'onnxruntime-node'
import * as fs from 'fs'
import * as path from 'path'
import ScalerParams from '../types/ScalerParams'
import PlayerMetricsInput from '../types/PlayerMetrics'
import ModelResult from '../types/ModelResult'

class ModelService {
    private modelPath: string = "./model/player-profile-clustering.onnx"
    private scalerPath: string = "./model/scaler_params.json"

    // Sempre atualizar isso com base no "MAPEAMENTO AUTOMÁTICO DOS CLUSTERS" do modelo
    private clusterNames: Record<number, string> = {
        0: "resistente",
        1: "explosivo",
        2: "baixo_volume",
        3: "moderado"
    }

    private scaler: ScalerParams
    private session: ort.InferenceSession | null = null

    constructor() {
        this.scaler = JSON.parse(fs.readFileSync(path.resolve(this.scalerPath), 'utf-8'))
    }

    public async predict(playerMetrics: PlayerMetricsInput): Promise<ModelResult> {
        const session = await this.getSession()

        const explosividade = this.calculateExplosividade(
            playerMetrics.sprintDistanceM,
            playerMetrics.distanceM,
            playerMetrics.topSpeedKph
        )

        const rawValues = [
            playerMetrics.distanceM,
            playerMetrics.highIntensityRunningM,
            playerMetrics.highIntensityEvents,
            playerMetrics.sprintDistanceM,
            playerMetrics.numberOfSprints,
            playerMetrics.topSpeedKph,
            playerMetrics.avgSpeedKph,
            playerMetrics.accelerations,
            playerMetrics.decelerations,
            playerMetrics.metresPerMinuteM,
            playerMetrics.workloadIntensity,
            explosividade
        ]

        const normalizedValues = this.normalize(rawValues)
        const input = new Float32Array(normalizedValues)
        const tensor = new ort.Tensor('float32', input, [1, 12])
        const results = await session.run({ float_input: tensor })

        return {
            label: results.label as ort.Tensor,
            scores: results.scores as ort.Tensor
        }
    }

    public interpretResult(result: ModelResult) {
        const clusterIndex = Number((result.label.data as BigInt64Array)[0])
        const distances = Array.from(result.scores.data as Float32Array)

        const invertedScores = distances.map(d => 1 / (d + 1e-10))
        const totalScore = invertedScores.reduce((a, b) => a + b, 0)

        const scorePercent = invertedScores.map(s =>
            parseFloat((s / totalScore * 100).toFixed(1))
        )

        return {
            clusterIndex,
            clusterName: this.clusterNames[clusterIndex],
            confidence: `${scorePercent[clusterIndex]}%`,
            allScores: distances.map((d, i) => ({
                cluster: this.clusterNames[i],
                score: `${scorePercent[i]}%`
            }))
        }
    }

    public async checkReadiness(): Promise<{
        model: "loaded" | "error"
        scaler: "loaded" | "error"
        errors: string[]
    }> {
        const errors: string[] = []

        const scalerExists = fs.existsSync(path.resolve(this.scalerPath))
        const modelExists = fs.existsSync(path.resolve(this.modelPath))

        let scaler: "loaded" | "error" = "loaded"
        let model: "loaded" | "error" = "loaded"

        if (!scalerExists) {
            scaler = "error"
            errors.push("scaler_params.json not found")
        }

        if (!modelExists) {
            model = "error"
            errors.push("player-profile-clustering.onnx not found")
        }

        if (scalerExists && !this.scaler) {
            scaler = "error"
            errors.push("scaler not loaded")
        }

        if (modelExists) {
            try {
                await this.getSession()
            } catch (error: unknown) {
                model = "error"
                errors.push(error instanceof Error ? error.message : "cannot load ONNX session")
            }
        }

        return {
            model,
            scaler,
            errors,
        }
    }

    private normalize(values: number[]): number[] {
        return values.map((value, i) => (value - this.scaler.mean[i]) / this.scaler.scale[i])
    }

    private calculateExplosividade(sprintDistance: number, distance: number, topSpeed: number): number {
        if (distance === 0) return 0
        return (sprintDistance / distance) * topSpeed
    }

    private async getSession(): Promise<ort.InferenceSession> {
        if (!this.session) {
            this.session = await ort.InferenceSession.create(this.modelPath)
        }
        return this.session
    }
}

export default ModelService