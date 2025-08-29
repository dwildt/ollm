# Plano: API JSON para Templates e Melhorias no Sistema de Modelos

## 🎯 Objetivos
1. **Modelo Padrão Inteligente**: Configurar "llama" como modelo padrão, com fallback para primeiro modelo disponível
2. **API JSON para Templates**: Implementar endpoint que retorna resposta em JSON quando URL termina com `.json`
3. **Documentação Completa**: Criar documentação detalhada dos templates e API no README

## 📋 Implementações Necessárias

### 1. Sistema de Modelo Padrão Inteligente
**Backend (`/backend/src/index.ts`):**
- Modificar endpoint `/api/chat` para usar lógica inteligente de seleção de modelo
- Buscar modelo "llama" ou variações ("llama2", "llama3.2", etc.) automaticamente
- Se não encontrar, usar o primeiro modelo disponível
- Atualizar variável DEFAULT_MODEL no `.env`

### 2. API JSON para Templates  
**Backend - Novo Endpoint:**
- Criar endpoint `/api/chat/:templateSlug.json` 
- Processar parâmetros da query string
- Gerar prompt do template com parâmetros
- Enviar para Ollama e retornar apenas resposta JSON
- Não persistir conversação (modo API puro)

**Frontend - Nova Rota:**
- Adicionar rota `/chat/:templateSlug.json` 
- Interceptar requisições `.json` e redirecionar para API
- Retornar response JSON diretamente (sem UI)

### 3. Documentação dos Templates
**README Principal:**
- Adicionar seção "Template System" com exemplos de uso
- Documentar formato das URLs com e sem `.json`
- Exemplos práticos para cada template existente

**README dos Templates (`/frontend/src/data/templates/README.md`):**
- Expandir documentação existente
- Adicionar seção "API Usage" 
- Exemplos de chamadas JSON para cada template
- Documentar parâmetros de cada template existente

## 📱 Exemplos de Uso Após Implementação

### Interface Gráfica (atual):
```
http://localhost:4000/chat/brainstorm?topic=startup&goal=crescer
```

### API JSON (novo):
```
http://localhost:4000/chat/brainstorm.json?topic=startup&goal=crescer
```
**Resposta:**
```json
{
  "template": "brainstorm",
  "prompt": "Vamos fazer uma sessão de brainstorm sobre: startup...",
  "response": "Aqui estão 10 ideias criativas para startup...",
  "model": "llama3.2:latest",
  "parameters": { "topic": "startup", "goal": "crescer" }
}
```

### Templates Disponíveis:
- `brainstorm.json` - Sessão de brainstorm
- `code-review.json` - Revisão de código  
- `english-teacher.json` - Professor de inglês
- `spanish-teacher.json` - Professor de espanhol
- `sql-optimizer.json` - Otimização SQL
- `marketing-copy.json` - Copy de marketing

## 🔧 Arquivos a Modificar

1. **Backend:**
   - `/backend/src/index.ts` - Lógica de modelo padrão e novo endpoint JSON
   - `/backend/.env` - Atualizar DEFAULT_MODEL

2. **Frontend:**
   - `/frontend/src/App.tsx` - Nova rota para `.json`
   - `/frontend/src/components/Chat.tsx` - Melhorar seleção de modelo padrão

3. **Documentação:**
   - `/README.md` - Seção Template System
   - `/frontend/src/data/templates/README.md` - Exemplos de API

## 🎯 Resultados Esperados
- Sistema mais inteligente para seleção de modelos
- API headless para automação e integração
- Documentação completa para desenvolvedores
- Flexibilidade para uso tanto em UI quanto programático

## 📁 Workflow do Projeto
1. ✅ Criar documentação em `.tasks/todo-json-call.md`
2. ⏳ Implementar todas as funcionalidades
3. ⏳ Renomear para `.tasks/done-json-call.md`
4. ⏳ Commit final com a mensagem: `feat: implementar API JSON para templates e seleção inteligente de modelo. Closes #12`

## 🏁 Commit Final
```
feat: implementar API JSON para templates e seleção inteligente de modelo. Closes #12
```