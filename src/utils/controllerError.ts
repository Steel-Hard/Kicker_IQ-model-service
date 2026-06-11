import { Response } from "express"
import AppError from "../errors/AppError"

function sendControllerError(res: Response, error: unknown): void {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
            code: error.code,
            details: error.details,
        })
        return
    }

    if (error instanceof Error) {
        res.status(400).json({
            error: error.message,
            code: "VALIDATION_ERROR",
        })
        return
    }

    res.status(500).json({
        error: "internal server error",
        code: "INTERNAL_ERROR",
    })
}

export default sendControllerError
