function parseNumericId(value: unknown, fieldName: string): number {
    const parsed = Number(value)

    if (Number.isNaN(parsed)) {
        throw new Error(`${fieldName} must be Number`)
    }

    return parsed
}

function parseDateParam(value: unknown, fieldName: string): string | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined
    }

    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) {
        throw new Error(`${fieldName} must be a valid date`)
    }

    return date.toISOString()
}

function parseIdsParam(value: unknown): number[] {
    if (value === undefined || value === null || value === "") {
        return []
    }

    const raw = String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

    return raw.map((id) => parseNumericId(id, "ids"))
}

function parseBucketParam(value: unknown): "day" | "week" | "month" {
    if (value === undefined || value === null || value === "") {
        return "week"
    }

    const bucket = String(value)
    if (bucket !== "day" && bucket !== "week" && bucket !== "month") {
        throw new Error("bucket must be day, week or month")
    }

    return bucket
}

function parseSegmentParam(value: unknown): string {
    if (value === undefined || value === null || value === "") {
        return "Whole Session"
    }

    return String(value)
}

export { parseBucketParam, parseDateParam, parseIdsParam, parseNumericId, parseSegmentParam }
