# PRD - Sistema de Conversas Locais e Funções Pré-carregadas

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

## Funcionalidades Detalhadas

### 1. Persistência de Conversas

#### 1.1 Salvamento Automático
- **Trigger**: A cada nova mensagem (usuário ou bot)
- **Storage**: localStorage do browser
- **Estrutura**: Conversas organizadas por ID único
- **Limite**: Máximo de 50 conversas salvas (configurável)
- **Limpeza**: Auto-remoção das conversas mais antigas quando atingir limite

#### 1.2 Gerenciamento de Conversas
- **Lista de Conversas**: Sidebar/modal mostrando conversas salvas
- **Preview**: Primeira mensagem + timestamp de cada conversa
- **Ações**: 
  - Continuar conversa existente
  - Renomear conversa
  - Deletar conversa
  - Exportar conversa (JSON/Markdown)

#### 1.3 Estrutura de Dados
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

### 2. Sistema de Templates (Funções Pré-carregadas)

#### 2.1 Definição de Templates
- **Arquivo de Configuração**: `frontend/src/data/conversation-templates.json`
- **Campos obrigatórios**: id, name, slug, prompt, description
- **Campos opcionais**: parameters, model, tags, category

#### 2.2 Estrutura do Template
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

#### 2.3 Interface de Templates
- **Seletor de Template**: Dropdown/grid mostrando templates disponíveis
- **Preview**: Mostrar descrição e parâmetros necessários
- **Formulário de Parâmetros**: Interface para preencher valores dos parâmetros
- **Categorização**: Organizar templates por categoria

### 3. Sistema de URLs Parametrizadas

#### 3.1 Formato de URL
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

#### 3.2 Roteamento
- **React Router**: Implementar rotas dinâmicas
- **Parâmetros de URL**: Parsing automático para preencher template
- **Validação**: Verificar parâmetros obrigatórios
- **Fallback**: Redirecionar para home se template não existir

### 4. Fluxo de Usuário

#### 4.1 Iniciando Nova Conversa
1. **Método 1 - Interface**: 
   - Usuário clica "Nova Conversa"
   - Escolhe template (opcional)
   - Preenche parâmetros se necessário
   - Inicia conversa com prompt gerado

2. **Método 2 - URL Direta**:
   - Usuário acessa URL com slug
   - Sistema carrega template correspondente
   - Preenche parâmetros da URL automaticamente
   - Inicia conversa imediatamente

#### 4.2 Continuando Conversa Existente
1. Usuário acessa lista de conversas salvas
2. Seleciona conversa desejada
3. Sistema restaura histórico completo
4. Usuário continua de onde parou

#### 4.3 Gerenciando Templates
1. **Admin Interface** (futuro): Interface para criar/editar templates
2. **Arquivo JSON** (atual): Edição manual do arquivo de configuração
3. **Import/Export**: Permitir compartilhar templates entre usuários

## Implementação Técnica

### 5.1 Frontend - Novos Componentes

#### ConversationManager
- Gerencia lista de conversas salvas
- Fornece interface para CRUD de conversas
- Handle localStorage operations

#### TemplateSelector
- Lista templates disponíveis
- Formulário para parâmetros
- Preview de prompt gerado

#### ParameterForm
- Componente dinâmico para diferentes tipos de parâmetros
- Validação de campos obrigatórios
- Preview em tempo real

#### ConversationSidebar
- Lista conversas salvas
- Ações rápidas (deletar, renomear)
- Busca e filtros

### 5.2 Services

#### conversationStorage.ts
```typescript
interface ConversationStorage {
  saveConversation(conversation: Conversation): void;
  loadConversation(id: string): Conversation | null;
  getAllConversations(): Conversation[];
  deleteConversation(id: string): void;
  updateConversationName(id: string, name: string): void;
}
```

#### templateService.ts  
```typescript
interface TemplateService {
  getTemplate(slug: string): Template | null;
  getAllTemplates(): Template[];
  getTemplatesByCategory(category: string): Template[];
  renderPrompt(template: Template, parameters: Record<string, any>): string;
}
```

### 5.3 Routing
```typescript
// App.tsx routes
<Route path="/chat" element={<Chat />} />
<Route path="/chat/:templateSlug" element={<Chat />} />
<Route path="/chat/conversation/:conversationId" element={<Chat />} />
```

### 5.4 URL Parameter Handling
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
- **Debounce**: Para salvamento automático
- **Pagination**: Para lista de conversas grandes

### Segurança
- **Sanitização**: Limpar parâmetros de URL
- **Validação**: Verificar tipos e limites de parâmetros
- **Rate Limiting**: Evitar spam de criação de conversas

### UX/UI
- **Loading States**: Durante carregamento de templates
- **Error Handling**: Templates não encontrados
- **Mobile First**: Interface responsiva
- **Keyboard Shortcuts**: Atalhos para ações comuns

## Fases de Implementação

### Fase 1 - Base (MVP)
- [ ] Persistência básica no localStorage
- [ ] Sistema de templates estático (JSON)
- [ ] Roteamento para templates
- [ ] Interface básica de seleção

### Fase 2 - Funcionalidades Avançadas
- [ ] Gerenciador de conversas (sidebar)
- [ ] Parâmetros de URL
- [ ] Formulários dinâmicos para parâmetros
- [ ] Categorização de templates

### Fase 3 - Melhorias
- [ ] Export/import de conversas
- [ ] Templates dinâmicos (interface admin)
- [ ] Compartilhamento de templates
- [ ] Analytics de uso

### Fase 4 - Otimizações
- [ ] Performance improvements
- [ ] Advanced search e filtros
- [ ] Template versioning
- [ ] Cloud sync (opcional)

## Métricas de Sucesso

- **Adoção**: % de usuários que salvam conversas
- **Engajamento**: Número médio de mensagens por conversa
- **Reutilização**: % de conversas continuadas
- **Templates**: Templates mais utilizados
- **Compartilhamento**: URLs de templates compartilhadas

## Riscos e Mitigações

### Riscos
1. **Storage Limits**: localStorage tem limites
2. **Performance**: Muitas conversas podem degradar performance
3. **Data Loss**: Usuário pode perder dados limpando browser
4. **URL Length**: URLs muito longas com parâmetros grandes

### Mitigações
1. **Compressão**: Comprimir dados antes de salvar
2. **Pagination/Lazy Loading**: Carregar conversas sob demanda
3. **Export/Backup**: Permitir backup manual dos dados
4. **POST Method**: Para parâmetros grandes, usar formulários