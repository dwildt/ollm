# Templates de Conversação

Este diretório contém templates individuais de conversação que são automaticamente carregados pelo sistema.

## Como Adicionar um Novo Template

1. **Criar arquivo JSON**: Crie um novo arquivo `.json` nesta pasta com um nome descritivo
2. **Seguir estrutura padrão**: Use a estrutura abaixo como base
3. **Reiniciar aplicação**: O template aparecerá automaticamente na interface

## Estrutura do Template

```json
{
  "id": "unique-template-id",
  "name": "Nome do Template",
  "slug": "template-slug", 
  "description": "Descrição clara do que o template faz",
  "category": "Categoria",
  "tags": ["tag1", "tag2", "tag3"],
  "model": "llama3.2:latest",
  "prompt": "Seu prompt aqui com {parametros} substituíveis",
  "parameters": [
    {
      "name": "parametro1",
      "type": "string",
      "required": true,
      "description": "Descrição do parâmetro"
    },
    {
      "name": "parametro2", 
      "type": "text",
      "required": false,
      "description": "Parâmetro opcional",
      "default": "valor padrão"
    }
  ]
}
```

## Tipos de Parâmetros

- **string**: Texto simples (input)
- **text**: Texto longo (textarea)
- **number**: Valores numéricos

## Campos Obrigatórios

- `id`: Identificador único
- `name`: Nome exibido na interface
- `slug`: Slug para URLs (usar kebab-case)
- `description`: Descrição do template
- `category`: Categoria para organização
- `tags`: Array de tags para busca
- `prompt`: Template do prompt com placeholders
- `parameters`: Array de parâmetros configuráveis

## Campos Opcionais

- `model`: Modelo padrão sugerido (se não especificado, usa o selecionado pelo usuário)

## Exemplos de Categorias

- Desenvolvimento
- Educação  
- Criatividade
- Marketing
- Banco de Dados
- Análise
- Escrita
- Tradução

## Dicas

1. **IDs únicos**: Use formato `categoria-funcao` (ex: `dev-code-review`)
2. **Nomes claros**: Seja específico sobre o que o template faz
3. **Descrições úteis**: Explique quando usar o template
4. **Tags relevantes**: Facilite a descoberta com tags apropriadas
5. **Parâmetros bem documentados**: Descreva claramente cada parâmetro
6. **Teste**: Sempre teste seu template antes de commitar

## API Usage

Todos os templates podem ser acessados via API JSON usando URLs no formato:
```
http://localhost:4000/chat/{template-slug}.json?param1=value1&param2=value2
```

### Templates Disponíveis e Parâmetros

#### 1. Brainstorm (`brainstorm`)
**Descrição**: Sessão de brainstorm criativo sobre qualquer tópico
**Parâmetros**:
- `topic` (obrigatório): Tópico principal do brainstorm
- `goal` (opcional): Objetivo específico (padrão: "explorar possibilidades")
- `audience` (opcional): Público-alvo das ideias (padrão: "geral")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/brainstorm.json?topic=startup de delivery&goal=inovação&audience=millennials"
```

#### 2. Code Review (`code-review`)
**Descrição**: Análise e revisão de código com feedback detalhado
**Parâmetros**:
- `language` (obrigatório): Linguagem de programação
- `code` (obrigatório): Código a ser revisado
- `focus` (opcional): Área de foco da revisão (padrão: "qualidade geral")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/code-review.json?language=JavaScript&code=function test(){return 1}&focus=performance"
```

#### 3. English Teacher (`english-teacher`)
**Descrição**: Ensino de inglês personalizado por nível
**Parâmetros**:
- `level` (obrigatório): Nível do estudante
- `topic` (obrigatório): Tópico da lição
- `skill` (opcional): Habilidade a focar (padrão: "conversação")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/english-teacher.json?level=intermediate&topic=business&skill=writing"
```

#### 4. Spanish Teacher (`spanish-teacher`)
**Descrição**: Ensino de espanhol personalizado por nível
**Parâmetros**:
- `level` (obrigatório): Nível do estudante
- `topic` (obrigatório): Tópico da lição
- `skill` (opcional): Habilidade a focar (padrão: "conversação")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/spanish-teacher.json?level=beginner&topic=travel&skill=vocabulary"
```

#### 5. SQL Optimizer (`sql-optimizer`)
**Descrição**: Otimização de consultas SQL e análise de performance
**Parâmetros**:
- `database` (obrigatório): Sistema de banco de dados
- `query` (obrigatório): Query SQL a otimizar
- `performance` (opcional): Foco da otimização (padrão: "velocidade")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/sql-optimizer.json?database=MySQL&query=SELECT * FROM users&performance=memory"
```

#### 6. Marketing Copy (`marketing-copy`)
**Descrição**: Criação de copy para marketing e vendas
**Parâmetros**:
- `product` (obrigatório): Produto ou serviço
- `audience` (obrigatório): Público-alvo
- `tone` (opcional): Tom da comunicação (padrão: "persuasivo")

**Exemplo**:
```bash
curl "http://localhost:4000/chat/marketing-copy.json?product=SaaS de gestão&audience=PMEs&tone=profissional"
```

### Formato da Resposta JSON

Todos os endpoints retornam uma resposta no formato:
```json
{
  "template": "nome-do-template",
  "prompt": "Prompt processado com parâmetros substituídos",
  "response": "Resposta gerada pelo modelo de IA",
  "model": "modelo-utilizado",
  "parameters": {
    "parametro1": "valor1",
    "parametro2": "valor2"
  }
}
```

### Integração Programática

**Python**:
```python
import requests

response = requests.get('http://localhost:4000/chat/brainstorm.json', {
    'topic': 'app mobile',
    'goal': 'inovação',
    'audience': 'jovens'
})
data = response.json()
print(data['response'])
```

**JavaScript**:
```javascript
fetch('http://localhost:4000/chat/brainstorm.json?topic=app%20mobile&goal=inovação&audience=jovens')
  .then(response => response.json())
  .then(data => console.log(data.response));
```

**cURL**:
```bash
curl "http://localhost:4000/chat/brainstorm.json?topic=app%20mobile&goal=inovação&audience=jovens" | jq '.response'
```