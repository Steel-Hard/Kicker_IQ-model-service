import MetaClassesResponse, { MetaClassItem } from "../types/MetaClassesResponse"

class MetaService {
    private readonly classes: MetaClassItem[] = [
        {
            key: "resistente",
            label: "Resistente",
            color: "#1f77b4",
            order: 1,
            description: "Atleta com alta capacidade de sustentacao de carga ao longo da sessao.",
        },
        {
            key: "explosivo",
            label: "Explosivo",
            color: "#ff7f0e",
            order: 2,
            description: "Atleta com predominancia de acoes de alta intensidade e velocidade.",
        },
        {
            key: "baixo_volume",
            label: "Baixo Volume",
            color: "#2ca02c",
            order: 3,
            description: "Atleta com menor volume relativo de atividade no contexto analisado.",
        },
        {
            key: "moderado",
            label: "Moderado",
            color: "#9467bd",
            order: 4,
            description: "Atleta com distribuicao equilibrada entre volume e intensidade.",
        },
    ]

    public getClassesMetadata(): MetaClassesResponse {
        return {
            classes: this.classes,
            updatedAt: new Date().toISOString(),
        }
    }
}

export default MetaService
