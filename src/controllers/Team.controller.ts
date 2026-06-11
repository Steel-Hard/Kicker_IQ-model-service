import { Request, Response } from "express"
import TeamService from "../services/Team.service"
import { parseBucketParam, parseDateParam, parseIdsParam, parseSegmentParam } from "../utils/queryValidators"
import sendControllerError from "../utils/controllerError"

class TeamController {
    private readonly teamService: TeamService = new TeamService()

    public async getClassification(req: Request, res: Response): Promise<void> {
        try {
            const ids = parseIdsParam(req.query.ids)
            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)

            const response = await this.teamService.getTeamClassification({
                ids,
                from,
                to,
                segment,
            })

            res.status(200).json(response)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }

    public async getTrends(req: Request, res: Response): Promise<void> {
        try {
            const ids = parseIdsParam(req.query.ids)
            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)
            const bucket = parseBucketParam(req.query.bucket)

            const response = await this.teamService.getTeamTrends(
                {
                    ids,
                    from,
                    to,
                    segment,
                },
                bucket
            )

            res.status(200).json(response)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }
}

export default TeamController
