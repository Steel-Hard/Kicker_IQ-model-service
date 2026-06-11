type ClusterName = "resistente" | "explosivo" | "baixo_volume" | "moderado"

type ClassificationFilters = {
    ids?: number[]
    from?: string
    to?: string
    segment: string
}

type TeamClassificationAthlete = {
    athleteId: number
    dominantClass: ClusterName
    classPercentages: Record<ClusterName, number>
    sessions: number
}

type TeamClassificationResponse = {
    totalAthletes: number
    distribution: Record<ClusterName, number>
    percentages: Record<ClusterName, number>
    athletes: TeamClassificationAthlete[]
    filters: ClassificationFilters
    updatedAt: string
}

type TrendPoint = {
    period: string
    resistente: number
    explosivo: number
    baixo_volume: number
    moderado: number
}

type TeamTrendsResponse = {
    bucket: "day" | "week" | "month"
    points: TrendPoint[]
    filters: ClassificationFilters
    updatedAt: string
}

type AthleteTimelineItem = {
    date: string
    segment: string
    clusterName: ClusterName
    confidence: string
}

type AthleteTimelineResponse = {
    athleteId: number
    timeline: AthleteTimelineItem[]
    filters: Omit<ClassificationFilters, "ids">
    updatedAt: string
}

type AthleteProfileSummaryResponse = {
    athleteId: number
    dominantClass: ClusterName | "unknown"
    classPercentages: Record<ClusterName, number>
    totalSessions: number
    lastPredictionAt: string | null
    filters: Omit<ClassificationFilters, "ids">
    updatedAt: string
}

type AnalyticsSessionRow = {
    athleteId: number
    date: string
    segment: string
    metrics: {
        distanceM: number
        highIntensityRunningM: number
        highIntensityEvents: number
        sprintDistanceM: number
        numberOfSprints: number
        topSpeedKph: number
        avgSpeedKph: number
        accelerations: number
        decelerations: number
        metresPerMinuteM: number
        workloadIntensity: number
    }
}

export type {
    AnalyticsSessionRow,
    AthleteProfileSummaryResponse,
    AthleteTimelineResponse,
    ClassificationFilters,
    ClusterName,
    TeamClassificationResponse,
    TeamTrendsResponse,
    TrendPoint,
}
