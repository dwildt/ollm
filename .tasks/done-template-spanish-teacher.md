# Plano: Adicionar Template "Spanish Teacher"

## 🎯 Objetivo
Criar um novo template `spanish-teacher` baseado no template existente `english-teacher` para apoiar na compreensão de textos em espanhol.

## 📋 Análise do Template Base
O template `english-teacher` possui:
- **ID**: "english-teacher"
- **Categoria**: "Educação" 
- **Função**: Correção de textos em inglês com explicações gramaticais
- **Parâmetro**: Texto em inglês para correção
- **Prompt**: Professor experiente que corrige e explica erros

## 🛠 Implementação

### 1. Criar Arquivo JSON do Template
**Localização**: `frontend/src/data/templates/spanish-teacher.json`

**Estrutura Adaptada**:
```json
{
  "id": "spanish-teacher",
  "slug": "spanish-teacher", 
  "name": "Professor de Espanhol",
  "description": "Corrige textos em espanhol e explica erros gramaticais e de estilo",
  "category": "Educação",
  "tags": ["spanish", "grammar", "writing", "español"],
  "prompt": "Você é um professor de espanhol experiente. Corrija o seguinte texto e explique os erros encontrados:\n\n{text}",
  "parameters": [
    {
      "name": "text",
      "type": "text", 
      "required": true,
      "description": "Texto em espanhol para correção"
    }
  ]
}
```

### 2. Registrar Template no Sistema
**Arquivo**: `frontend/src/data/templates/index.ts`

**Mudanças necessárias**:
1. Adicionar import do novo template
2. Incluir no array de templates

**Código a adicionar**:
```typescript
// Adicionar import
import spanishTeacherTemplate from './spanish-teacher.json';

// Incluir no array
const templates: ConversationTemplate[] = [
  codeReviewTemplate as ConversationTemplate,
  englishTeacherTemplate as ConversationTemplate,
  spanishTeacherTemplate as ConversationTemplate, // NOVO
  brainstormTemplate as ConversationTemplate,
  sqlOptimizerTemplate as ConversationTemplate,
  marketingCopyTemplate as ConversationTemplate,
];
```

## 🔍 Diferenças do Template Base

### Adaptações para Espanhol:
- **ID/Slug**: `spanish-teacher` (único)
- **Nome**: "Professor de Espanhol" 
- **Descrição**: Focada em textos em espanhol
- **Tags**: Incluir "spanish", "español" além das tags de gramática
- **Prompt**: Mesma estrutura, mas especificando "espanhol"
- **Parâmetro**: Descrição atualizada para "Texto em espanhol"

### Mantido do Original:
- **Categoria**: "Educação" (mesma)
- **Estrutura de parâmetros**: Idêntica (apenas 1 parâmetro text)
- **Tipo de parâmetro**: "text" para textos longos
- **Obrigatoriedade**: Parâmetro required=true
- **Funcionalidade**: Correção + explicação de erros

## 🧪 Testes Necessários

### 1. Verificação Técnica:
- ✅ Template aparece na lista de templates
- ✅ Template é selecionável na interface
- ✅ Formulário de parâmetros é exibido corretamente
- ✅ Validação de parâmetro obrigatório funciona

### 2. Teste Funcional:
- ✅ Inserir texto em espanhol no parâmetro
- ✅ Submeter formulário gera prompt corretamente
- ✅ Prompt contém o texto substitutído
- ✅ LLM responde adequadamente em português explicando erros em espanhol

### 3. Teste de Integração:
- ✅ Template funciona com sistema de traduções PT/EN/ES
- ✅ Compatível com salvamento de conversas
- ✅ Funciona com diferentes modelos LLM

## 📝 Exemplo de Uso

**Input do usuário**:
```
Hola, me llama Juan y soy de Madrid. Trabajo en una empresa grande.
Ayer fuí al mercado para comprar frutas y verduras frescas.
```

**Prompt gerado**:
```
Você é um professor de espanhol experiente. Corrija o seguinte texto e explique os erros encontrados:

Hola, me llama Juan y soy de Madrid. Trabajo en una empresa grande.
Ayer fuí al mercado para comprar frutas y verduras frescas.
```

**Resultado esperado**:
- Correção: "me llamo" em vez de "me llama"
- Correção: "fui" em vez de "fuí" (acentuação)
- Explicações gramaticais detalhadas

## 🎯 Benefícios

### Para Usuários:
- **Aprendizado de Espanhol**: Ferramenta dedicada para correção
- **Explicações Detalhadas**: Entender erros gramaticais
- **Prática**: Melhorar escrita em espanhol
- **Acessibilidade**: Interface em português para brasileiros

### Para Sistema:
- **Especialização**: Template focado em espanhol
- **Complementaridade**: Junto com english-teacher, cobre 3 idiomas
- **Reutilização**: Aproveitamento da estrutura existente
- **Escalabilidade**: Modelo para outros idiomas (french-teacher, etc.)

## 🔧 Considerações Técnicas

### Compatibilidade:
- ✅ Usa estrutura padrão de templates
- ✅ Compatível com sistema de carregamento dinâmico
- ✅ Seguirá convenções de naming e organização
- ✅ TypeScript type-safe

### Manutenibilidade:
- ✅ Arquivo independente facilita edições
- ✅ Documentado no README de templates
- ✅ Seguirá padrão de versionamento Git
- ✅ Testável unitariamente

Este template será uma adição valiosa para usuários que estudam ou trabalham com espanhol!