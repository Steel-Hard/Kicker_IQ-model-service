# Meta Routes

## GET /api/meta/classes

Retorna os metadados das classes usados pelo microservico para exibicao e integracao com o frontend.

### Objetivo

- Evitar hardcode de labels, cores e ordem no frontend.
- Centralizar o dicionario atual de classes expostas pelo modelo.

### Resposta 200

```json
{
  "classes": [
    {
      "key": "resistente",
      "label": "Resistente",
      "color": "#1f77b4",
      "order": 1,
      "description": "Atleta com alta capacidade de sustentacao de carga ao longo da sessao."
    },
    {
      "key": "explosivo",
      "label": "Explosivo",
      "color": "#ff7f0e",
      "order": 2,
      "description": "Atleta com predominancia de acoes de alta intensidade e velocidade."
    },
    {
      "key": "baixo_volume",
      "label": "Baixo Volume",
      "color": "#2ca02c",
      "order": 3,
      "description": "Atleta com menor volume relativo de atividade no contexto analisado."
    },
    {
      "key": "moderado",
      "label": "Moderado",
      "color": "#9467bd",
      "order": 4,
      "description": "Atleta com distribuicao equilibrada entre volume e intensidade."
    }
  ],
  "updatedAt": "2026-06-09T12:00:00.000Z"
}
```

### Respostas de erro

- 200: endpoint atualmente nao possui caminhos de erro de negocio.

### Observacoes

- updatedAt e gerado dinamicamente a cada resposta.
- A lista atual reflete o mapeamento de classes utilizado pelo microservico nesta fase do projeto.
