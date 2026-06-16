import db from "../db"
import { AnalyticsSessionRow } from "../types/TeamAnalytics"

class TeamRepository {
    public async selectDistinctAthleteIds(): Promise<number[]> {
        const query = `
            SELECT DISTINCT p."Athlete ID" AS id
            FROM public.players p
            WHERE p."Athlete ID" IS NOT NULL
            ORDER BY p."Athlete ID" ASC
        `

        const res = await db.query(query)
        return res.rows.map((row: { id: number }) => Number(row.id))
    }

    public async selectAvailableSegments(): Promise<string[]> {
        return ['Whole Session']
    }

    public async selectSessionsForAnalytics(filters: {
        ids?: number[]
        from?: string
        to?: string
        segment: string
    }): Promise<AnalyticsSessionRow[]> {
        const conditions: string[] = [
            'p."Athlete ID" IS NOT NULL'
        ]
        const params: Array<string | number[] | number> = []

        if (filters.ids && filters.ids.length > 0) {
            params.push(filters.ids)
            conditions.push(`p."Athlete ID" = ANY($${params.length})`)
        }

        if (filters.from) {
            params.push(filters.from)
            conditions.push(`p."Start Date" >= $${params.length}`)
        }

        if (filters.to) {
            params.push(filters.to)
            conditions.push(`p."Start Date" <= $${params.length}`)
        }

        const query = `
            SELECT
                p."Athlete ID"::bigint                                                   AS "athleteId",
                p."Start Date"::timestamptz                                              AS date,
                'Whole Session'                                                          AS segment,
                COALESCE(p."Distance (m)", 0)::double precision                         AS "distanceM",
                COALESCE(p."Sprint Distance" * 2.2, 0)::double precision                AS "highIntensityRunningM",
                COALESCE((p."Sprint Distance" / 15.0) * 1.5, 0)::double precision      AS "highIntensityEvents",
                COALESCE(p."Sprint Distance", 0)::double precision                       AS "sprintDistanceM",
                COALESCE(p."Sprint Distance" / 18.0, 0)::double precision              AS "numberOfSprints",
                COALESCE(p."Top Speed", 0)::double precision                             AS "topSpeedKph",
                COALESCE(p."Avg Speed (kph)", 0)::double precision                       AS "avgSpeedKph",
                COALESCE((p."Distance (m)" / 130.0) * (p."Avg Speed (kph)" / 5.0), 55)::double precision AS accelerations,
                COALESCE((p."Distance (m)" / 120.0) * (p."Avg Speed (kph)" / 5.0), 60)::double precision AS decelerations,
                COALESCE(p."Distance (m)" / NULLIF(p."Duration (mins)", 0), 72)::double precision       AS "metresPerMinuteM",
                COALESCE((p."Distance (m)" / 1000.0) * (p."Avg Speed (kph)" / 4.0), 7)::double precision AS "workloadIntensity"
            FROM public.players p
            WHERE ${conditions.join(" AND ")}
            ORDER BY p."Start Date" ASC, p."Start Time" ASC
        `

        const res = await db.query(query, params)

        return res.rows.map((row: {
            athleteId: number
            date: string
            segment: string
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
        }) => ({
            athleteId: Number(row.athleteId),
            date: row.date,
            segment: row.segment,
            metrics: {
                distanceM: row.distanceM,
                highIntensityRunningM: row.highIntensityRunningM,
                highIntensityEvents: row.highIntensityEvents,
                sprintDistanceM: row.sprintDistanceM,
                numberOfSprints: row.numberOfSprints,
                topSpeedKph: row.topSpeedKph,
                avgSpeedKph: row.avgSpeedKph,
                accelerations: row.accelerations,
                decelerations: row.decelerations,
                metresPerMinuteM: row.metresPerMinuteM,
                workloadIntensity: row.workloadIntensity,
            },
        }))
    }
}

export default TeamRepository
