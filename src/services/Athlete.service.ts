import AthleteRepository from "../repositories/Athlete.repository"
import PlayerMetricsInput from "../types/PlayerMetrics"
import ModelService from "./Model.service"
import {
    AthleteProfileSummaryResponse,
    AthleteTimelineResponse,
    ClassificationFilters,
    ClusterName,
} from "../types/TeamAnalytics"

class AthleteService {
    private athleteIdRepository: AthleteRepository = new AthleteRepository()
    private modelService: ModelService = new ModelService()

    private readonly defaultCounts: Record<ClusterName, number> = {
        resistente: 0,
        explosivo: 0,
        baixo_volume: 0,
        moderado: 0,
    }

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

    public async getAthleteProfileTimeline(
        athleteId: number,
        filters: Omit<ClassificationFilters, "ids">
    ): Promise<AthleteTimelineResponse> {
        const sessions = await this.athleteIdRepository.selectSessionsForAthleteAnalytics({
            athleteId,
            from: filters.from,
            to: filters.to,
            segment: filters.segment,
        })

        const timeline: AthleteTimelineResponse["timeline"] = []

        for (const session of sessions) {
            const modelResult = await this.modelService.predict(session.metrics)
            const interpreted = this.modelService.interpretResult(modelResult)

            timeline.push({
                date: session.date,
                segment: session.segment,
                clusterName: interpreted.clusterName as ClusterName,
                confidence: interpreted.confidence,
            })
        }

        return {
            athleteId,
            timeline,
            filters,
            updatedAt: new Date().toISOString(),
        }
    }

    public async getAthleteProfileSummary(
        athleteId: number,
        filters: Omit<ClassificationFilters, "ids">
    ): Promise<AthleteProfileSummaryResponse> {
        const timeline = await this.getAthleteProfileTimeline(athleteId, filters)
        const counts: Record<ClusterName, number> = { ...this.defaultCounts }

        for (const row of timeline.timeline) {
            counts[row.clusterName] += 1
        }

        const totalSessions = timeline.timeline.length
        const classPercentages = Object.fromEntries(
            Object.entries(counts).map(([label, count]) => [
                label,
                totalSessions > 0 ? parseFloat((count / totalSessions * 100).toFixed(1)) : 0,
            ])
        ) as Record<ClusterName, number>

        const dominantClass = totalSessions > 0
            ? (Object.entries(classPercentages).sort((a, b) => b[1] - a[1])[0][0] as ClusterName)
            : "unknown"

        const lastPredictionAt = totalSessions > 0
            ? timeline.timeline[totalSessions - 1].date
            : null

        return {
            athleteId,
            dominantClass,
            classPercentages,
            totalSessions,
            lastPredictionAt,
            filters,
            updatedAt: new Date().toISOString(),
        }
    }
}

export default AthleteService