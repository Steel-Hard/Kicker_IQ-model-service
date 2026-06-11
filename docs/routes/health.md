# Health Routes

## GET /api/health/model

Retorna o estado do banco, do arquivo scaler e do carregamento do modelo ONNX.

### Objetivo

- Facilitar diagnostico operacional do microservico.
- Permitir verificacao automatizada em deploy, monitoramento ou debug.

### Resposta 200

Usada quando todas as dependencias estao disponiveis.

```json
{
  "status": "ok",
  "timestamp": "2026-06-09T12:00:00.000Z",
  "dependencies": {
    "db": {
      "status": "up",
      "latencyMs": 41
    },
    "model": {
      "status": "loaded"
    },
    "scaler": {
      "status": "loaded"
    }
  }
}
```

### Resposta 503

Usada quando ao menos uma dependencia critica falha.

```json
{
  "status": "degraded",
  "timestamp": "2026-06-09T12:00:00.000Z",
  "dependencies": {
    "db": {
      "status": "down",
      "error": "db query failed"
    },
    "model": {
      "status": "error",
      "error": "player-profile-clustering.onnx not found"
    },
    "scaler": {
      "status": "loaded"
    }
  }
}
```

### Respostas de erro

- 500: falha inesperada durante a composicao do healthcheck.

### Observacoes

- O endpoint consulta o banco com SELECT 1.
- O endpoint valida existencia do scaler e do arquivo ONNX.
- O endpoint tenta inicializar a sessao do modelo para confirmar readiness real.
