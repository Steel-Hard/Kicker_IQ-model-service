# Routes

Este diretorio documenta as rotas atualmente expostas pelo microservico Kicker_IQ-model-service.

## Base URL

- Local: http://localhost:3002/api
- Docker: http://localhost:3002/api

## Endpoints disponiveis

- POST /match/predict
- POST /athletes/batch-predict
- GET /athlete/metrics
- GET /athlete/:id/profile-timeline
- GET /athlete/:id/profile-summary
- GET /team/classification
- GET /team/trends
- GET /meta/classes
- GET /health/model
- GET /reports/team-classification.json
- GET /reports/team-classification.csv

## Documentacao por dominio

- [match.md](match.md): predicao individual de perfil a partir de metricas.
- [athlete.md](athlete.md): classificacao historica agregada por atleta.
- [meta.md](meta.md): metadados das classes para frontend.
- [health.md](health.md): saude do banco, scaler e modelo ONNX.
- [report.md](report.md): exportacoes analiticas JSON e CSV.

## Convencoes gerais

- Todas as rotas ficam sob o prefixo /api.
- O servico responde em JSON, exceto quando retornar status sem corpo em erros genericos.
- Em erros internos, alguns endpoints respondem apenas com status 500.
- O banco usado pelo microservico depende de POSTGRESQL_URL.
