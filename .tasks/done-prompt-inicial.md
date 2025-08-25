Crie uma aplicação web simples para interface gráfica do Ollama. 

Requisitos:

STACK:
- Frontend: React com TypeScript 
- Backend: Node.js/Express
- Ollama rodando em localhost:11434

FUNCIONALIDADES ESSENCIAIS:
- Chat interface limpa e responsiva
- Seletor de modelos disponíveis no Ollama
- Histórico de conversas na sessão
- Indicador de "typing" durante respostas
- Campo de input com botão enviar
- Limpeza do chat

ESTRUTURA DO PROJETO:

oll/ 
├── frontend/ # React app 
├── backend/ # Express server
├── package.json # Root package.json 
└── README.md


REQUISITOS TÉCNICOS:
- API REST entre frontend/backend
- Estado local simples (sem banco de dados)
- Styling básico com CSS modules ou styled-components
- Error handling para quando Ollama está offline
- Auto-scroll no chat
- Suporte a markdown nas respostas

CONFIGURAÇÃO:
- Scripts npm para rodar dev (frontend + backend)
- Dockerfile opcional para containerização
- Variáveis de ambiente para configuração
- Validação se Ollama está rodando

Mantenha o código limpo, bem documentado e fácil de entender. Priorize simplicidade sobre features avançadas.

Montar .gitignore. Montar README. Montar arquivo LICENSE usando a mesma MIT. Montar um arquivo claude com as regras principais para quem quiser evoluir. 

Permitir trocar o idioma entre português e inglês. Montar uma estrutura fácil de poder embarcar outros idiomas. Montar um arquivo de localização para demonstrar para tradutores como evoluir neste sentido.

TESTES E VALIDAÇÃO:
- Implementar testes usando JEST para todos os componentes e serviços
- Adicionar testes End-to-End usando Playwright para funcionalidade completa do chat
- Configurar validação de lint usando ESLint com regras específicas para React/TypeScript e Node.js
- Testes unitários para frontend: componentes React, serviços de API, hooks
- Testes unitários para backend: endpoints da API, integração com Ollama, tratamento de erros
- Testes E2E: fluxo completo do chat, troca de idiomas, seleção de modelos, responsividade
- Scripts automatizados para execução de todos os tipos de teste
- Cobertura de testes para garantir qualidade do código
- Validação de tipos TypeScript em build e desenvolvimento
- Pre-commit hooks para garantir qualidade antes do commit

ESTRUTURA DE TESTES OBRIGATÓRIA:
- frontend/src/components/__tests__/ - Testes de componentes React
- frontend/src/services/__tests__/ - Testes de serviços e APIs  
- backend/src/__tests__/ - Testes de endpoints e lógica do servidor
- e2e/ - Testes End-to-End com Playwright
- Configuração Jest para frontend e backend
- Configuração Playwright para testes E2E
- ESLint configurado para ambos os projetos
- Scripts npm para executar todos os tipos de teste 

