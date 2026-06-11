import { Request, Response } from "express";
import AthleteService from "../services/Athlete.service";
import { parseDateParam, parseNumericId, parseSegmentParam } from "../utils/queryValidators";
import sendControllerError from "../utils/controllerError";

class AthleteController {
    private athleteService: AthleteService = new AthleteService()

    /**
     * `GET | http://0.0.0.0:0000/athlete/metrics`
     */
    public async getMetrics(req: Request, res: Response) {
        try {
            const { id } = req.query

            if (!id) {
                res.status(401).json({ error: "id is missing" })
                return
            }

            if (isNaN(Number(id))) {
                res.status(401).json({ error: "id must be Number" })
                return
            }

            const athleteExists = await this.athleteService.getAthleteExists(Number(id))
            if (!athleteExists) {
                res.status(404).json({ error: "athlete not exists" })
                return
            }

            const response = await this.athleteService.calcAthleteType(Number(id))
            res.status(200).json(response)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }

    public async getProfileTimeline(req: Request, res: Response): Promise<void> {
        try {
            const athleteId = parseNumericId(req.params.id, "id")

            const athleteExists = await this.athleteService.getAthleteExists(athleteId)
            if (!athleteExists) {
                res.status(404).json({ error: "athlete not exists" })
                return
            }

            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)

            const response = await this.athleteService.getAthleteProfileTimeline(athleteId, {
                from,
                to,
                segment,
            })

            res.status(200).json(response)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }

    public async getProfileSummary(req: Request, res: Response): Promise<void> {
        try {
            const athleteId = parseNumericId(req.params.id, "id")

            const athleteExists = await this.athleteService.getAthleteExists(athleteId)
            if (!athleteExists) {
                res.status(404).json({ error: "athlete not exists" })
                return
            }

            const from = parseDateParam(req.query.from, "from")
            const to = parseDateParam(req.query.to, "to")
            const segment = parseSegmentParam(req.query.segment)

            const response = await this.athleteService.getAthleteProfileSummary(athleteId, {
                from,
                to,
                segment,
            })

            res.status(200).json(response)
        } catch (error: unknown) {
            sendControllerError(res, error)
        }
    }
}

export default AthleteController