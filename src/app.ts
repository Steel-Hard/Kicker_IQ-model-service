import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import matchRoutes from './routes/match.routes'
import athleteRoutes from './routes/athlete.routes'
import metaRoutes from './routes/meta.routes'
import healthRoutes from './routes/health.routes'
import teamRoutes from './routes/team.routes'
import reportRoutes from './routes/report.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", matchRoutes)
app.use("/api", athleteRoutes)
app.use("/api", metaRoutes)
app.use("/api", healthRoutes)
app.use("/api", teamRoutes)
app.use("/api", reportRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app