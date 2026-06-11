import { TeamClassificationResponse } from "../types/TeamAnalytics"

function escapeCsv(value: string | number): string {
    const text = String(value)
    if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
        return `"${text.replace(/"/g, '""')}"`
    }

    return text
}

function serializeTeamClassificationCsv(data: TeamClassificationResponse): string {
    const header = [
        "athleteId",
        "dominantClass",
        "sessions",
        "resistente",
        "explosivo",
        "baixo_volume",
        "moderado",
    ]

    const lines = [header.join(",")]

    for (const athlete of data.athletes) {
        lines.push([
            escapeCsv(athlete.athleteId),
            escapeCsv(athlete.dominantClass),
            escapeCsv(athlete.sessions),
            escapeCsv(athlete.classPercentages.resistente),
            escapeCsv(athlete.classPercentages.explosivo),
            escapeCsv(athlete.classPercentages.baixo_volume),
            escapeCsv(athlete.classPercentages.moderado),
        ].join(","))
    }

    return lines.join("\n")
}

export default serializeTeamClassificationCsv
