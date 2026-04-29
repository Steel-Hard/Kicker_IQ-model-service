import db from "../db"
import PlayerMetricsInput from "../types/PlayerMetrics"

class AthleteRepository {
    public async selectMatchWholeSessionPerAthlete(athleteId: number): Promise<PlayerMetricsInput[]> {
        const query = `
            SELECT
                ps.distance_m                   AS "distanceM",
                ps.high_intensity_running_m     AS "highIntensityRunningM",
                ps.no_high_intensity_events     AS "highIntensityEvents",
                ps.sprint_distance_m            AS "sprintDistanceM",
                ps.no_sprints                   AS "numberOfSprints",
                ps.top_speed_kph                AS "topSpeedKph",
                ps.avg_speed_kph                AS "avgSpeedKph",
                ps.accelerations                AS "accelerations",
                ps.decelerations                AS "decelerations",
                ps.metres_per_minute            AS "metresPerMinuteM",
                ps.workload_intensity           AS "workloadIntensity"
            FROM performance_segment ps
            JOIN match m ON m.id = ps.match_id
            WHERE ps.athlete_id = $1
              AND ps.segment_name = 'Whole Session'
            ORDER BY m.match_date ASC
        `
        const res = await db.query(query, [athleteId])
        return res.rows as PlayerMetricsInput[]
    }

    public async selectAthlete(athleteId: number) {
        const query = `
            SELECT *
            FROM athlete
            WHERE id = $1
        `
        const res = await db.query(query, [athleteId])
        return res.rows[0]
    }
}

export default AthleteRepository