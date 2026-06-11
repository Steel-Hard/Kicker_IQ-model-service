# Athlete Routes

## GET /api/athlete/metrics?id={athleteId}

Retorna a distribuicao historica de classes para um atleta, considerando os registros Whole Session armazenados no banco.

### Objetivo

- Permitir que o sistema mostre o perfil predominante do atleta ao longo do historico.
- Alimentar telas de atleta e comparacoes no backend principal.

### Query params

- id: obrigatorio, numero do atleta.

### Exemplo de requisicao

```http
GET /api/athlete/metrics?id=2240331969
```

### Resposta 200

```json
{
  "resistente": 12.5,
  "explosivo": 62.5,
  "baixo_volume": 0,
  "moderado": 25
}
```

### Regras aplicadas

- Busca o atleta na tabela public.players.
- Considera apenas registros com Segment Name = Whole Session.
- Executa a inferencia para cada sessao historica.
- Calcula o percentual de ocorrencia de cada classe no total.

### Respostas de erro

- 401:

```json
{ "error": "id is missing" }
```

- 401:

```json
{ "error": "id must be Number" }
```

- 404:

```json
{ "error": "athlete not exists" }
```

- 500: erro interno durante consulta ou inferencia.

### Observacoes

- Se o atleta tiver historico vazio, a distribuicao retorna 0 para todas as classes.
- O endpoint depende da compatibilidade do schema public.players com o mapeamento do repository.
