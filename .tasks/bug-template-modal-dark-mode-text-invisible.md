# Bug: Texto Invisível na Modal de Templates no Dark Mode

**Problema**: Texto da modal de seleção de templates fica invisível no modo escuro devido a variáveis CSS incorretas.

**Status**: IDENTIFICADO - 09/09/2025

## Análise do Problema

### Sintomas
- Modal de templates abre normalmente no dark mode
- Conteúdo da modal (texto, botões, cards) fica invisível ou ilegível
- Light mode funciona corretamente
- Background da modal está correto

### Causa Raiz
O arquivo `TemplateModalSelector.css` está usando variáveis CSS que **não existem** no sistema de design:

```css
/* Variáveis INCORRETAS em uso: */
--color-background        /* ❌ Não existe */
--color-surface          /* ❌ Não existe */
--color-surface-secondary /* ❌ Não existe */
--color-surface-hover    /* ❌ Não existe */
```

### Variáveis Corretas Disponíveis
Sistema de design em `colors.css` define:
```css
/* Variáveis CORRETAS disponíveis: */
--color-bg-primary       /* ✅ Existe */
--color-bg-secondary     /* ✅ Existe */  
--color-bg-card          /* ✅ Existe */
```

### Linhas Problemáticas
`frontend/src/components/molecules/TemplateModalSelector/TemplateModalSelector.css`:

- **Linha 30**: `background: var(--color-background)` → Input de busca
- **Linha 49**: `background: var(--color-surface-secondary)` → Chips de categoria  
- **Linha 89**: `background: var(--color-surface)` → Cards de template
- **Linha 62**: `background: var(--color-surface-hover)` → Estados hover

## Solução Proposta

### 1. Mapeamento de Variáveis
```css
/* Substituições necessárias: */
var(--color-background)        → var(--color-bg-primary)
var(--color-surface)          → var(--color-bg-card)
var(--color-surface-secondary) → var(--color-bg-secondary)
var(--color-surface-hover)    → var(--color-neutral-100) [light] / var(--color-neutral-800) [dark]
```

### 2. Adicionar Variável Ausente
Adicionar `--color-surface-hover` no sistema de design:
```css
/* Em colors.css */
:root {
  --color-surface-hover: var(--color-neutral-100);
}

[data-theme="dark"] {
  --color-surface-hover: var(--color-neutral-800);
}
```

## Arquivos a Modificar

1. **`frontend/src/components/molecules/TemplateModalSelector/TemplateModalSelector.css`**
   - Corrigir 4 ocorrências de variáveis inexistentes
   
2. **`frontend/src/design-system/tokens/colors.css`**
   - Adicionar `--color-surface-hover` se necessário

## Teste de Validação

### Cenários de Teste
1. **Light Mode**: Modal deve continuar funcionando normalmente
2. **Dark Mode**: Texto deve ficar visível e legível
3. **Toggle**: Alternância entre modos deve funcionar sem problemas

### Comandos de Teste
```bash
npm run test:e2e           # Testes E2E incluem modal-dark-mode.spec.ts
npm run dev                # Teste manual em localhost:4000
```

## Impacto

### Antes da Correção
- ❌ Texto invisível no dark mode
- ❌ Experiência de usuário prejudicada
- ❌ Modal inutilizável no modo escuro

### Depois da Correção
- ✅ Texto visível em ambos os modos
- ✅ Experiência consistente
- ✅ Modal totalmente funcional

## Commit Planejado

```
fix: corrigir texto invisível na modal no dark mode
```

## Referências

- **Arquivo de teste existente**: `e2e/modal-dark-mode.spec.ts`
- **Sistema de design**: `frontend/src/design-system/tokens/colors.css`
- **Componente afetado**: `frontend/src/components/molecules/TemplateModalSelector/`

---
**Documentado em**: 09/09/2025  
**Tipo**: Bug Fix  
**Prioridade**: Alta (afeta UX no dark mode)