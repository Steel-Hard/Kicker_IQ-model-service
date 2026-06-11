type MetaClassItem = {
    key: string
    label: string
    color: string
    order: number
    description: string
}

type MetaClassesResponse = {
    classes: MetaClassItem[]
    updatedAt: string
}

export type { MetaClassItem }
export default MetaClassesResponse
