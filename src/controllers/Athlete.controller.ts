import { Request, Response } from "express";
import AthleteService from "../services/Athlete.service";

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
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default AthleteController