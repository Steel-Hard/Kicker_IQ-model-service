import AthleteRepository from "../repositories/Athlete.repository"
import PlayerMetricsInput from "../types/PlayerMetrics"
import ModelService from "./Model.service"

class AthleteService {
    private athleteIdRepository: AthleteRepository = new AthleteRepository()
    private modelService: ModelService = new ModelService()

    public async getAthleteExists(playerId: number) {
        const athlete = await this.athleteIdRepository.selectAthlete(playerId)
        if (athlete) {
            return true
        } else {
            return false
        }
    }

    public async calcAthleteType(playerId: number) {
        const matches: PlayerMetricsInput[] = await this.athleteIdRepository.selectMatchWholeSessionPerAthlete(playerId)

        const counts: Record<string, number> = {
            resistente: 0,
            explosivo: 0,
            baixo_volume: 0,
            moderado: 0,
        }

        for (const match of matches) {
            const modelResult = await this.modelService.predict(match)
            const interpreted = this.modelService.interpretResult(modelResult)
            counts[interpreted.clusterName]++
        }

        const total = matches.length

        return Object.fromEntries(
            Object.entries(counts).map(([label, count]) => [
                label,
                total > 0 ? parseFloat((count / total * 100).toFixed(1)) : 0
            ])
        ) as Record<string, number>
    }
}

export default AthleteService