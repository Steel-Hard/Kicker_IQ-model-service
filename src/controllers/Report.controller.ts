import { Request, Response } from "express"
import ReportService from "../services/Report.service"
import { parseDateParam, parseIdsParam, parseSegmentParam } from "../utils/queryValidators"
import sendControllerError from "../utils/controllerError"

class ReportController {
    private readonly reportService: ReportService = new ReportService()

    public async getTeamClassificationJson(req: Request, res: Response): Promise<void> {
        try {
            const ids = parseIdsParam(req.query.ids)
            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)

            const response = await this.reportService.getTeamClassificationJson({
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

    public async getTeamClassificationCsv(req: Request, res: Response): Promise<void> {
        try {
            const ids = parseIdsParam(req.query.ids)
            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)

            const csv = await this.reportService.getTeamClassificationCsv({
                ids,
                from,
                to,
                segment,
            })

            res.setHeader("Content-Type", "text/csv; charset=utf-8")
            res.setHeader("Content-Disposition", "attachment; filename=team-classification.csv")
            res.status(200).send(csv)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }
}

export default ReportController
