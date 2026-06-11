# Match Routes

## POST /api/match/predict

Executa a predicao do perfil do atleta com base em um conjunto de metricas de entrada.

### Objetivo

- Permitir que backend ou frontend enviem metricas de uma sessao/partida e recebam a classificacao do modelo.

### Body

```json
{
  "distanceM": 10234.5,
  "highIntensityRunningM": 980.2,
  "highIntensityEvents": 22,
  "sprintDistanceM": 240.4,
  "numberOfSprints": 18,
  "topSpeedKph": 31.7,
  "avgSpeedKph": 6.3,
  "accelerations": 41,
  "decelerations": 39,
  "metresPerMinuteM": 102.4,
  "workloadIntensity": 73.8
}
```

### Campos esperados

- distanceM: numero
- highIntensityRunningM: numero
- highIntensityEvents: numero
- sprintDistanceM: numero
- numberOfSprints: numero
- topSpeedKph: numero
- avgSpeedKph: numero
- accelerations: numero
- decelerations: numero
- metresPerMinuteM: numero
- workloadIntensity: numero

### Resposta 200

```json
{
  "clusterIndex": 1,
  "clusterName": "explosivo",
  "confidence": "54.3%",
  "allScores": [
    { "cluster": "resistente", "score": "12.8%" },
    { "cluster": "explosivo", "score": "54.3%" },
    { "cluster": "baixo_volume", "score": "15.4%" },
    { "cluster": "moderado", "score": "17.5%" }
  ]
}
```

### Respostas de erro

- 500: erro interno durante inferencia ou carregamento de modelo.

### Observacoes

- O endpoint calcula internamente a feature de explosividade antes da inferencia.
- O resultado depende do modelo ONNX e do arquivo scaler_params.json presentes em model/.

## POST /api/athletes/batch-predict

Executa predicao em lote com retorno parcial por item, sem interromper o processamento inteiro quando uma entrada falha.

### Objetivo

- Reduzir overhead de multiplas chamadas sequenciais para /match/predict.
- Permitir processamento robusto de lote para backend e jobs operacionais.

### Body

```json
{
  "athletes": [
    {
      "athleteId": 2240331969,
      "metrics": {
        "distanceM": 10234.5,
        "highIntensityRunningM": 980.2,
        "highIntensityEvents": 22,
        "sprintDistanceM": 240.4,
        "numberOfSprints": 18,
        "topSpeedKph": 31.7,
        "avgSpeedKph": 6.3,
        "accelerations": 41,
        "decelerations": 39,
        "metresPerMinuteM": 102.4,
        "workloadIntensity": 73.8
      }
    }
  ]
}
```

### Regras

- athletes deve ser um array.
- Tamanho minimo do lote: 1 item.
- Tamanho maximo do lote: 200 itens.

### Resposta 200

```json
{
  "total": 2,
  "successCount": 1,
  "failureCount": 1,
  "results": [
    {
      "index": 0,
      "athleteId": 2240331969,
      "status": "success",
      "prediction": {
        "clusterIndex": 1,
        "clusterName": "explosivo",
        "confidence": "54.3%",
        "allScores": []
      }
    },
    {
      "index": 1,
      "athleteId": 99,
      "status": "error",
      "error": "prediction failed"
    }
  ]
}
```

### Respostas de erro

- 400: erro de validacao do payload (array ausente, lote vazio, limite excedido).
- 500: erro inesperado.
