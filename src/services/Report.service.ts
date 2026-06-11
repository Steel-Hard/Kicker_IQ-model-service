import TeamService from "./Team.service"
import { ClassificationFilters, TeamClassificationResponse } from "../types/TeamAnalytics"
import serializeTeamClassificationCsv from "../utils/serializeTeamClassificationCsv"

class ReportService {
    private readonly teamService: TeamService = new TeamService()

    public async getTeamClassificationJson(filters: ClassificationFilters): Promise<TeamClassificationResponse> {
        return this.teamService.getTeamClassification(filters)
    }

    public async getTeamClassificationCsv(filters: ClassificationFilters): Promise<string> {
        const classification = await this.teamService.getTeamClassification(filters)
        return serializeTeamClassificationCsv(classification)
    }
}

export default ReportService
