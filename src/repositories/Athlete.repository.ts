import db from "../db"
import PlayerMetricsInput from "../types/PlayerMetrics"

class AthleteRepository {
    public async selectMatchWholeSessionPerAthlete(athleteId: number): Promise<PlayerMetricsInput[]> {
        const query = `
            SELECT
                COALESCE(p."Distance (m)", 0)::double precision                       AS "distanceM",
                COALESCE(p."High Intensity Running (m)", 0)::double precision         AS "highIntensityRunningM",
                COALESCE(p."No. of High Intensity Events", 0)::double precision       AS "highIntensityEvents",
                COALESCE(p."Sprint Distance (m)", 0)::double precision                 AS "sprintDistanceM",
                COALESCE(p."No. of Sprints", 0)::double precision                      AS "numberOfSprints",
                COALESCE(p."Top Speed (kph)", 0)::double precision                     AS "topSpeedKph",
                COALESCE(p."Avg Speed (kph)", 0)::double precision                     AS "avgSpeedKph",
                COALESCE(p."Accelerations", 0)::double precision                       AS "accelerations",
                COALESCE(p."Decelerations", 0)::double precision                       AS "decelerations",
                COALESCE(p."Metres per Minute (m)", 0)::double precision               AS "metresPerMinuteM",
                COALESCE(p."Workload Intensity", 0)::double precision                  AS "workloadIntensity"
            FROM public.players p
            WHERE p."Athlete ID" = $1
                AND p."Segment Name" = 'Whole Session'
            ORDER BY p."Start Date" ASC, p."Start Time" ASC
        `
        const res = await db.query(query, [athleteId])
        return res.rows as PlayerMetricsInput[]
    }

    public async selectAthlete(athleteId: number) {
        const query = `
            SELECT p."Athlete ID" AS id
            FROM public.players p
            WHERE p."Athlete ID" = $1
            LIMIT 1
        `
        const res = await db.query(query, [athleteId])
        return res.rows[0]
    }
}

export default AthleteRepository