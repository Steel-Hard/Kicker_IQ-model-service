import TeamRepository from "../repositories/Team.repository"
import ModelService from "./Model.service"
import {
    ClassificationFilters,
    ClusterName,
    TeamClassificationResponse,
    TeamTrendsResponse,
    TrendPoint,
} from "../types/TeamAnalytics"

class TeamService {
    private readonly teamRepository: TeamRepository = new TeamRepository()
    private readonly modelService: ModelService = new ModelService()

    private readonly defaultCounts: Record<ClusterName, number> = {
        resistente: 0,
        explosivo: 0,
        baixo_volume: 0,
        moderado: 0,
    }

    public async getDistinctAthleteIds(): Promise<number[]> {
        return this.teamRepository.selectDistinctAthleteIds()
    }

    public async getAvailableSegments(): Promise<string[]> {
        return this.teamRepository.selectAvailableSegments()
    }

    public async getTeamClassification(filters: ClassificationFilters): Promise<TeamClassificationResponse> {
        const sessions = await this.teamRepository.selectSessionsForAnalytics(filters)
        const byAthlete = new Map<number, Record<ClusterName, number>>()

        for (const session of sessions) {
            const modelResult = await this.modelService.predict(session.metrics)
            const interpreted = this.modelService.interpretResult(modelResult)
            const clusterName = interpreted.clusterName as ClusterName

            if (!byAthlete.has(session.athleteId)) {
                byAthlete.set(session.athleteId, { ...this.defaultCounts })
            }

            const current = byAthlete.get(session.athleteId)
            if (current) {
                current[clusterName] += 1
            }
        }

        const athletes: TeamClassificationResponse["athletes"] = []
        const distribution: Record<ClusterName, number> = { ...this.defaultCounts }

        for (const [athleteId, counts] of byAthlete.entries()) {
            const sessionsCount = Object.values(counts).reduce((acc, value) => acc + value, 0)
            const percentages = this.toPercentages(counts, sessionsCount)
            const dominantClass = this.getDominantClass(percentages)

            distribution[dominantClass] += 1

            athletes.push({
                athleteId,
                dominantClass,
                classPercentages: percentages,
                sessions: sessionsCount,
            })
        }

        const totalAthletes = athletes.length
        const percentages = this.toPercentages(distribution, totalAthletes)

        return {
            totalAthletes,
            distribution,
            percentages,
            athletes,
            filters,
            updatedAt: new Date().toISOString(),
        }
    }

    public async getTeamTrends(
        filters: ClassificationFilters,
        bucket: "day" | "week" | "month"
    ): Promise<TeamTrendsResponse> {
        const sessions = await this.teamRepository.selectSessionsForAnalytics(filters)
        const pointsMap = new Map<string, TrendPoint>()

        for (const session of sessions) {
            const modelResult = await this.modelService.predict(session.metrics)
            const interpreted = this.modelService.interpretResult(modelResult)
            const clusterName = interpreted.clusterName as ClusterName

            const period = this.toPeriodBucket(session.date, bucket)
            if (!pointsMap.has(period)) {
                pointsMap.set(period, {
                    period,
                    ...this.defaultCounts,
                })
            }

            const point = pointsMap.get(period)
            if (point) {
                point[clusterName] += 1
            }
        }

        const points = Array.from(pointsMap.values()).sort((a, b) => a.period.localeCompare(b.period))

        return {
            bucket,
            points,
            filters,
            updatedAt: new Date().toISOString(),
        }
    }

    private toPercentages<T extends Record<ClusterName, number>>(counts: T, total: number): T {
        return Object.fromEntries(
            Object.entries(counts).map(([label, count]) => [
                label,
                total > 0 ? parseFloat((count / total * 100).toFixed(1)) : 0,
            ])
        ) as T
    }

    private getDominantClass(percentages: Record<ClusterName, number>): ClusterName {
        const entries = Object.entries(percentages) as Array<[ClusterName, number]>
        entries.sort((a, b) => b[1] - a[1])
        return entries[0][0]
    }

    private toPeriodBucket(date: string, bucket: "day" | "week" | "month"): string {
        const current = new Date(date)

        if (bucket === "day") {
            return current.toISOString().slice(0, 10)
        }

        if (bucket === "week") {
            const dateUTC = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()))
            const dayNumber = dateUTC.getUTCDay() || 7
            dateUTC.setUTCDate(dateUTC.getUTCDate() + 4 - dayNumber)

            const yearStart = new Date(Date.UTC(dateUTC.getUTCFullYear(), 0, 1))
            const weekNumber = Math.ceil((((dateUTC.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
            return `${dateUTC.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`
        }

        return `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, "0")}`
    }
}

export default TeamService
