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