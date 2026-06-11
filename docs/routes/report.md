# Report Routes

## GET /api/reports/team-classification.json

Retorna a classificacao do elenco em JSON, usando os mesmos filtros dos endpoints de analytics.

### Query params

- ids: opcional, lista separada por virgula.
- from: opcional, data inicial.
- to: opcional, data final.
- segment: opcional, default Whole Session.

### Resposta 200

```json
{
  "totalAthletes": 2,
  "distribution": {
    "resistente": 1,
    "explosivo": 1,
    "baixo_volume": 0,
    "moderado": 0
  },
  "percentages": {
    "resistente": 50,
    "explosivo": 50,
    "baixo_volume": 0,
    "moderado": 0
  },
  "athletes": [
    {
      "athleteId": 1,
      "dominantClass": "resistente",
      "classPercentages": {
        "resistente": 75,
        "explosivo": 25,
        "baixo_volume": 0,
        "moderado": 0
      },
      "sessions": 4
    }
  ],
  "filters": {
    "ids": [],
    "segment": "Whole Session"
  },
  "updatedAt": "2026-06-11T12:00:00.000Z"
}
```

### Respostas de erro

- 400: erro de validacao em parametros.
- 500: erro inesperado.

## GET /api/reports/team-classification.csv

Retorna o mesmo conjunto de classificacao em formato CSV para download.

### Query params

- ids: opcional, lista separada por virgula.
- from: opcional, data inicial.
- to: opcional, data final.
- segment: opcional, default Whole Session.

### Resposta 200

Headers:

- Content-Type: text/csv; charset=utf-8
- Content-Disposition: attachment; filename=team-classification.csv

Exemplo de conteudo:

```csv
athleteId,dominantClass,sessions,resistente,explosivo,baixo_volume,moderado
2240331969,explosivo,8,12.5,62.5,0,25
```

### Respostas de erro

- 400: erro de validacao em parametros.
- 500: erro inesperado.
