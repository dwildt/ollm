# PRD - Sistema de Conversas Locais e Funções Pré-carregadas (BASE)

## Visão Geral

Implementar um sistema que permita aos usuários salvar conversas localmente, criar templates de conversas reutilizáveis (funções pré-carregadas) e iniciar conversas através de URLs parametrizadas.

## Objetivos

### Primários
- **Persistência Local**: Salvar conversas no localStorage para não perder histórico
- **Templates de Conversa**: Criar funções pré-definidas com prompts personalizados
- **Acesso via URL**: Permitir iniciar conversas específicas através de slugs na URL
- **Parametrização**: Passar parâmetros via URL que são injetados nos prompts

### Secundários
- Melhorar a experiência do usuário com workflows predefinidos
- Facilitar reutilização de prompts complexos
- Permitir compartilhamento de templates via URL

## Funcionalidades - Fases 1 e 2

### FASE 1 - Base (MVP)

#### 1.1 Persistência de Conversas

##### Salvamento Automático
- **Trigger**: A cada nova mensagem (usuário ou bot)
- **Storage**: localStorage do browser
- **Estrutura**: Conversas organizadas por ID único
- **Limite**: Máximo de 50 conversas salvas (configurável)
- **Limpeza**: Auto-remoção das conversas mais antigas quando atingir limite

##### Estrutura de Dados
```json
{
  "conversations": {
    "conv_123": {
      "id": "conv_123",
      "name": "Conversa sobre React",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T11:45:00Z",
      "model": "llama3.2:latest",
      "templateId": null,
      "messages": [
        {
          "id": "msg_456",
          "text": "Como criar um componente React?",
          "isUser": true,
          "timestamp": "2025-01-15T10:30:00Z"
        }
      ]
    }
  }
}
```

#### 1.2 Sistema de Templates (Estático)

##### Arquivo de Configuração
- **Local**: `frontend/src/data/conversation-templates.json`
- **Campos obrigatórios**: id, name, slug, prompt, description
- **Campos opcionais**: parameters, model, tags, category

##### Estrutura do Template
```json
{
  "templates": [
    {
      "id": "code-review",
      "name": "Revisor de Código",
      "slug": "code-review",
      "description": "Analisa código e sugere melhorias",
      "category": "Desenvolvimento",
      "tags": ["code", "review", "programming"],
      "model": "llama3.2:latest",
      "prompt": "Você é um revisor de código experiente. Analise o seguinte código em {language} e forneça sugestões de melhoria:\n\n{code}\n\nFoque em: performance, legibilidade, boas práticas e possíveis bugs.",
      "parameters": [
        {
          "name": "language",
          "type": "string",
          "required": true,
          "description": "Linguagem de programação do código"
        },
        {
          "name": "code",
          "type": "text",
          "required": true,
          "description": "Código a ser revisado"
        }
      ]
    },
    {
      "id": "english-teacher",
      "slug": "english-teacher",
      "name": "Professor de Inglês",
      "description": "Corrige textos em inglês e explica erros",
      "category": "Educação",
      "prompt": "Você é um professor de inglês experiente. Corrija o seguinte texto e explique os erros encontrados:\n\n{text}",
      "parameters": [
        {
          "name": "text",
          "type": "text",
          "required": true,
          "description": "Texto em inglês para correção"
        }
      ]
    },
    {
      "id": "brainstorm",
      "slug": "brainstorm",
      "name": "Sessão de Brainstorm",
      "description": "Geração de ideias criativas sobre um tópico",
      "category": "Criatividade",
      "prompt": "Vamos fazer uma sessão de brainstorm sobre: {topic}\n\nObjetivo: {goal}\nPúblico-alvo: {audience}\n\nGere 10 ideias criativas e práticas.",
      "parameters": [
        {
          "name": "topic",
          "type": "string",
          "required": true,
          "description": "Tópico principal do brainstorm"
        },
        {
          "name": "goal",
          "type": "string", 
          "required": false,
          "description": "Objetivo específico",
          "default": "explorar possibilidades"
        },
        {
          "name": "audience",
          "type": "string",
          "required": false,
          "description": "Público-alvo das ideias",
          "default": "geral"
        }
      ]
    }
  ]
}
```

#### 1.3 Interface Básica de Seleção
- **Seletor de Template**: Dropdown simples mostrando templates disponíveis
- **Preview**: Mostrar descrição do template selecionado
- **Início Rápido**: Botão para iniciar conversa com template

### FASE 2 - Funcionalidades Avançadas

#### 2.1 Sistema de URLs Parametrizadas

##### Formato de URL
```
# Template sem parâmetros
https://app.com/chat/english-teacher

# Template com parâmetros
https://app.com/chat/code-review?language=javascript&code=function%20hello()%20%7B%0A%20%20console.log(%22hello%22);%0A%7D

# Conversa existente
https://app.com/chat/conversation/conv_123

# Nova conversa com template e parâmetros
https://app.com/chat/brainstorm?topic=marketing%20digital&goal=aumentar%20vendas&audience=pequenas%20empresas
```

##### Roteamento
- **React Router**: Implementar rotas dinâmicas
- **Parâmetros de URL**: Parsing automático para preencher template
- **Validação**: Verificar parâmetros obrigatórios
- **Fallback**: Redirecionar para home se template não existir

#### 2.2 Gerenciamento de Conversas

##### Lista de Conversas
- **Interface**: Sidebar mostrando conversas salvas
- **Preview**: Primeira mensagem + timestamp de cada conversa
- **Ações básicas**: 
  - Continuar conversa existente
  - Deletar conversa

##### Formulário de Parâmetros
- **Componente dinâmico**: Para diferentes tipos de parâmetros
- **Validação**: Campos obrigatórios
- **Preview**: Mostrar prompt gerado em tempo real

#### 2.3 Interface Avançada de Templates
- **Grid/Lista**: Visualização melhorada dos templates
- **Categorização**: Organizar templates por categoria
- **Busca**: Filtrar templates por nome/categoria
- **Formulários**: Interface para preencher parâmetros dos templates

## Implementação Técnica

### Frontend - Novos Componentes

#### ConversationStorage (Service)
```typescript
interface ConversationStorage {
  saveConversation(conversation: Conversation): void;
  loadConversation(id: string): Conversation | null;
  getAllConversations(): Conversation[];
  deleteConversation(id: string): void;
  updateConversationName(id: string, name: string): void;
}
```

#### TemplateService (Service)
```typescript
interface TemplateService {
  getTemplate(slug: string): Template | null;
  getAllTemplates(): Template[];
  getTemplatesByCategory(category: string): Template[];
  renderPrompt(template: Template, parameters: Record<string, any>): string;
}
```

#### ConversationSidebar (Component)
- Lista conversas salvas
- Ações básicas (deletar)
- Busca simples

#### TemplateSelector (Component)
- Lista templates disponíveis
- Preview de descrição
- Seleção rápida

#### ParameterForm (Component)
- Formulário dinâmico para parâmetros
- Validação de campos obrigatórios
- Preview de prompt gerado

### Routing
```typescript
// App.tsx routes
<Route path="/chat" element={<Chat />} />
<Route path="/chat/:templateSlug" element={<Chat />} />
<Route path="/chat/conversation/:conversationId" element={<Chat />} />
```

### URL Parameter Handling
```typescript
// useTemplateFromUrl.ts
const useTemplateFromUrl = () => {
  const { templateSlug } = useParams();
  const [searchParams] = useSearchParams();
  
  const template = templateSlug ? templateService.getTemplate(templateSlug) : null;
  const parameters = Object.fromEntries(searchParams.entries());
  
  return { template, parameters };
};
```

## Casos de Uso

### Caso 1: Desenvolvedor fazendo Code Review
1. Acessa `https://app.com/chat/code-review?language=python`
2. Sistema carrega template "Revisor de Código"
3. Campo "language" já preenchido com "python"
4. Usuário cola código no parâmetro "code"
5. Sistema gera prompt e inicia conversa
6. Conversa é salva automaticamente

### Caso 2: Estudante corrigindo inglês
1. Clica em "Nova Conversa" 
2. Seleciona template "Professor de Inglês"
3. Preenche texto a ser corrigido
4. Inicia conversa
5. Pode compartilhar URL gerada com outros

### Caso 3: Equipe fazendo brainstorm
1. Líder cria URL: `https://app.com/chat/brainstorm?topic=novo%20produto&audience=millennials`
2. Compartilha link com equipe
3. Cada membro acessa e tem conversa personalizada
4. Podem salvar suas conversas individualmente

## Considerações Técnicas

### Performance
- **Lazy Loading**: Carregar templates sob demanda
- **Debounce**: Para salvamento automático (500ms)
- **Pagination**: Para lista de conversas (20 por página)

### Segurança
- **Sanitização**: Limpar parâmetros de URL
- **Validação**: Verificar tipos e limites de parâmetros
- **Rate Limiting**: Evitar spam de criação de conversas

### UX/UI
- **Loading States**: Durante carregamento de templates
- **Error Handling**: Templates não encontrados
- **Mobile First**: Interface responsiva
- **Keyboard Shortcuts**: Enter para enviar, Esc para limpar

## Fluxo de Implementação

### Fase 1 - Checklist
- [ ] Criar estrutura de dados para conversas
- [ ] Implementar localStorage service
- [ ] Criar arquivo de templates JSON
- [ ] Implementar template service
- [ ] Modificar Chat.tsx para salvar conversas
- [ ] Criar interface básica de seleção de templates
- [ ] Testes unitários para services
- [ ] Testes E2E para persistência

### Fase 2 - Checklist  
- [ ] Implementar React Router com rotas dinâmicas
- [ ] Criar hook para parsing de URLs
- [ ] Implementar ParameterForm component
- [ ] Criar ConversationSidebar component
- [ ] Melhorar TemplateSelector com categorias
- [ ] Implementar validação de parâmetros
- [ ] Testes unitários para componentes
- [ ] Testes E2E para URLs parametrizadas

## Critérios de Sucesso

### Fase 1
- ✅ Conversas são salvas automaticamente no localStorage
- ✅ Templates carregam corretamente do JSON
- ✅ Interface permite selecionar templates básicos
- ✅ Prompts são gerados corretamente
- ✅ Todos os testes passam

### Fase 2
- ✅ URLs com slugs carregam templates corretos
- ✅ Parâmetros de URL preenchem formulários
- ✅ Sidebar mostra conversas salvas
- ✅ Formulários validam parâmetros obrigatórios
- ✅ Todos os testes passam
- ✅ Interface é responsiva e acessível

## Métricas de Validação

- **Funcionalidade**: Todos os casos de uso funcionam conforme esperado
- **Performance**: Carregamento < 500ms para templates
- **Qualidade**: 100% dos testes unitários e E2E passando
- **Code Quality**: ESLint sem warnings, TypeScript sem erros