# Plano: Refatorar Templates para Arquivos Separados

## 🎯 Objetivo
Dividir os templates de conversação em arquivos individuais para facilitar a adição de novos templates, tornando o sistema mais modular e escalável.

## 📁 Estrutura Proposta

### Nova Estrutura de Diretórios:
```
frontend/src/data/templates/
├── index.ts                    # Loader dinâmico de templates
├── code-review.json           # Template: Revisor de Código
├── english-teacher.json       # Template: Professor de Inglês  
├── brainstorm.json           # Template: Sessão de Brainstorm
├── sql-optimizer.json        # Template: Otimizador SQL
├── marketing-copy.json       # Template: Redator de Marketing
└── README.md                 # Documentação sobre como criar novos templates
```

## 🔄 Mudanças Técnicas

### 1. Criar Arquivos Individuais de Templates
- Migrar cada template do `conversation-templates.json` para arquivo próprio
- Cada arquivo conterá apenas um template (sem array wrapper)
- Manter estrutura JSON idêntica ao atual

### 2. Sistema de Carregamento Dinâmico
- Criar `templates/index.ts` que:
  - Importa automaticamente todos os arquivos `.json` da pasta
  - Combina em array único de templates
  - Exporta como `TemplateCollection`

### 3. Atualizar TemplateService
- Modificar import no `templateService.ts`
- Manter API pública inalterada
- Sistema permanece transparente para componentes

### 4. Webpack Configuration  
- Adicionar suporte para carregamento dinâmico de JSONs
- Garantir que novos arquivos sejam incluídos no build

## 🛠 Implementação

### Fase 1: Estrutura Base
1. Criar diretório `frontend/src/data/templates/`
2. Criar arquivo `index.ts` com sistema de carregamento
3. Adicionar `README.md` com documentação

### Fase 2: Migração dos Templates
1. Dividir `conversation-templates.json` em 5 arquivos separados:
   - `code-review.json`
   - `english-teacher.json` 
   - `brainstorm.json`
   - `sql-optimizer.json`
   - `marketing-copy.json`

### Fase 3: Integração
1. Atualizar import no `templateService.ts`
2. Remover arquivo `conversation-templates.json` antigo
3. Testar funcionalidade completa

## 📋 Benefícios

### Para Desenvolvedores:
- **Facilidade**: Adicionar novo template = criar novo arquivo JSON
- **Organização**: Um template por arquivo, mais limpo
- **Versionamento**: Git tracking individual por template
- **Manutenção**: Editar templates específicos sem conflitos

### Para Sistema:
- **Modularidade**: Templates independentes
- **Escalabilidade**: Suporte a centenas de templates
- **Performance**: Carregamento otimizado (se necessário lazy loading futuro)
- **Flexibilidade**: Templates podem ter estruturas ligeiramente diferentes

## 🧪 Testes Necessários

### Funcionais:
- ✅ Todos os templates existentes continuam funcionando
- ✅ TemplateSelector carrega templates corretamente  
- ✅ ParameterForm funciona com todos os templates
- ✅ Sistema de validação mantém compatibilidade

### Unitários:
- ✅ TemplateService.getAllTemplates() retorna todos os templates
- ✅ Carregamento individual funciona corretamente
- ✅ Sistema trata erros de arquivos malformados

### E2E:
- ✅ Fluxo completo de seleção e uso de templates
- ✅ Templates são visíveis na interface
- ✅ Parâmetros são editáveis e funcionais

## 📝 Documentação

### README.md para Templates:
```markdown
# Como Adicionar Novo Template

1. Criar arquivo `novo-template.json` nesta pasta
2. Seguir estrutura padrão:
   ```json
   {
     "id": "unique-id",
     "name": "Nome do Template", 
     "slug": "template-slug",
     "description": "Descrição...",
     "category": "Categoria",
     "tags": ["tag1", "tag2"],
     "prompt": "Prompt com {parametros}",
     "parameters": [...]
   }
   ```
3. Reiniciar aplicação - template aparecerá automaticamente
```

## 🔧 Considerações Técnicas

### Compatibilidade:
- Manter interface `TemplateService` inalterada
- Componentes React não precisam de mudanças
- Sistema de tipos TypeScript mantido

### Performance:
- Carregamento síncrono na inicialização (como atual)
- Possibilidade futura de lazy loading se necessário
- Bundle size similar ao atual

### Segurança:
- Validação de estrutura JSON mantida
- Tratamento de erros para arquivos malformados
- TypeScript garante type safety

Este plano mantém total compatibilidade com o sistema atual enquanto torna muito mais fácil adicionar novos templates no futuro.