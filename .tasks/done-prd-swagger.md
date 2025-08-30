# Plano: Documentação Swagger API

## 🎯 Objetivos
1. **Documentação Interativa**: Implementar Swagger UI para documentação e teste das APIs
2. **Schemas TypeScript**: Definir schemas automáticos para requests/responses
3. **Endpoint Dedicado**: Criar `/api-docs` para acesso à documentação
4. **Manutenção Automática**: Configurar geração automática da documentação

## 📋 Implementações Necessárias

### 1. Dependências Backend
**Instalar no `backend/`:**
- `swagger-jsdoc`: Geração de docs a partir de comentários JSDoc
- `swagger-ui-express`: Interface web interativa
- `@types/swagger-jsdoc`: Tipos TypeScript
- `@types/swagger-ui-express`: Tipos TypeScript

### 2. Configuração Swagger
**Arquivo `backend/src/swagger.ts`:**
- Configuração base do Swagger (título, versão, servidor)
- Definição de schemas TypeScript para:
  - `GET /api/models` - Lista de modelos
  - `GET /api/health` - Status do Ollama
  - `POST /api/chat` - Chat principal
  - `GET /api/:templateSlug` - API de templates
- Configuração apenas para ambiente de desenvolvimento

### 3. Integração no Express
**Atualizar `backend/src/index.ts`:**
- Importar configuração Swagger
- Adicionar rota `/api-docs` (dev only)
- Adicionar comentários JSDoc nos endpoints existentes
- Manter princípio "Simplicity over complexity"

### 4. Documentação JSDoc
**Para cada endpoint existente:**
- `GET /api/models`: Schema da resposta com array de modelos
- `GET /api/health`: Schema do status de saúde
- `POST /api/chat`: Schemas de request/response do chat
- `GET /api/:templateSlug`: Schema dinâmico com parâmetros

## 🧪 Testes Requeridos

### 1. Testes Unitários
**Arquivo `backend/src/__tests__/swagger.test.ts`:**
- Teste de configuração Swagger válida
- Validação de schemas gerados
- Teste de carregamento da documentação
- Verificação de ambiente (dev only)

### 2. Testes de Integração
**Adicionar em `backend/src/__tests__/api.test.ts`:**
- Teste do endpoint `/api-docs` (200 em dev, 404 em prod)
- Validação de schemas com dados reais dos endpoints
- Teste de resposta JSON válida da documentação

### 3. Testes E2E
**Arquivo `e2e/swagger.spec.ts`:**
- Navegação para `/api-docs` durante desenvolvimento
- Teste de interface Swagger UI carregada
- Validação de todos os endpoints documentados
- Teste de execução de requests via Swagger UI

## 🔄 Fluxo de Trabalho

### Para Desenvolvedores
1. **Acesso**: `http://localhost:4001/api-docs` durante desenvolvimento
2. **Teste Interativo**: Usar Swagger UI para testar endpoints
3. **Documentação**: Sempre atualizar JSDoc ao modificar APIs

### Para Novos Templates
1. **Obrigatório**: Documentar parâmetros no arquivo JSON do template
2. **Schema**: Swagger deve refletir automaticamente novos parâmetros
3. **Validação**: Testar via Swagger UI antes do commit

## ✅ Critérios de Aceitação

### Funcionalidade
- [ ] Endpoint `/api-docs` disponível em desenvolvimento
- [ ] Interface Swagger UI carregada corretamente
- [ ] Todos os 4 endpoints principais documentados
- [ ] Schemas válidos para requests/responses
- [ ] Documentação não disponível em produção

### Testes
- [ ] Cobertura ≥80% para arquivos Swagger
- [ ] Todos os testes unitários passando
- [ ] Testes E2E validando interface
- [ ] Integração com suite de testes existente

### Documentação
- [ ] Comentários JSDoc em todos os endpoints
- [ ] Schemas TypeScript bem definidos
- [ ] Diretrizes adicionadas ao CLAUDE.md
- [ ] Exemplos de uso para cada endpoint

### Qualidade
- [ ] Princípio "Simplicity over complexity" mantido
- [ ] Zero breaking changes nos endpoints existentes
- [ ] Performance não impactada
- [ ] Configuração minimalista e focada

## 🔧 Configuração de Ambiente

### Desenvolvimento
```bash
# Backend com Swagger habilitado
cd backend
npm run dev
# Acesso: http://localhost:4001/api-docs
```

### Produção
```bash
# Swagger desabilitado automaticamente
NODE_ENV=production npm start
# /api-docs retorna 404
```

## 📝 Commit Message
```
feat: add swagger api documentation. Closes #16
```