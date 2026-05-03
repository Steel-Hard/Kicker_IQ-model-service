# Kicker_IQ-model-service

Este é o serviço de produção (API) que coloca o modelo de machine learning em uso.

- Linguagem: TypeScript (Node.js).
- Propósito: Expor uma API REST que recebe dados de um atleta e retorna em qual "cluster" (perfil) ele se encaixa, usando o modelo treinado anteriormente.
- Arquivos Chave:
  - src/services/Model.service.ts: O "coração" do serviço. Ele carrega o arquivo .onnx e usa a biblioteca onnxruntime-node para executar a inferência em tempo real.
  - package.json: Usa o framework Express para o servidor e pg para conectar ao banco de dados PostgreSQL.
- Fluxo: Quando a API recebe métricas de um jogador (distância percorrida, velocidade máxima, sprints, etc.), ela normaliza esses dados e pergunta ao modelo ONNX qual é o perfil do jogador.

# ONNX (Open Neural Network Exchange)

Uma especie de "tradutor universal" para modelos de Inteligência Artificial e Machine Learning. Em Kicker ele resolve alguns problemas de arquitetura:

1. O Problema da "Língua"
   Normalmente, os cientistas de dados preferem Python (usado no microserviço model-kmeans) porque as bibliotecas de treinamento são as melhores. No entanto, desenvolvedores de sistemas
   muitas vezes preferem Node.js/TypeScript (usado no seu model-service) para criar APIs rápidas e escaláveis.

Sem o ONNX, você seria obrigado a rodar o código de produção em Python também, o que nem sempre é o ideal para a performance ou infraestrutura da sua API.

2. A Solução ONNX
   O ONNX permite que você:
1. Treine o modelo no Python (usando bibliotecas como Scikit-Learn, PyTorch ou TensorFlow).
1. Exporte esse modelo para um arquivo único com a extensão .onnx.
1. Execute esse arquivo em praticamente qualquer outra linguagem (no seu caso, o Node.js) sem precisar ter o Python instalado e sem precisar reescrever a lógica matemática do modelo.

Resumo das Vantagens em Kicker:

- Interoperabilidade: O model-service em Node.js não precisa entender como o modelo foi treinado, ele apenas "roda" o arquivo .onnx.
- Performance: O motor que executa o ONNX (chamado ONNX Runtime) é extremamente otimizado e rápido, muitas vezes mais veloz do que rodar o modelo original em Python.
- Portabilidade: Se amanhã você decidir mudar a API para Go, C# ou Java, você poderá usar o mesmo arquivo .onnx sem mudanças.

No código (Model.service.ts), a biblioteca onnxruntime-node abre esse arquivo, recebe os números dos atletas e devolve a classificação quase instantaneamente.
