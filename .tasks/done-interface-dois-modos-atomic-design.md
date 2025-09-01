# TODO: Interface com Dois Modos usando Atomic Design

**Status:** TODO  
**Data Criação:** 2025-09-01  
**Estimativa:** 5-7 dias  

## Objetivo
Reestruturar a interface do OLLM implementando dois modos distintos de uso ("Conversa Livre" e "Templates") utilizando os princípios do Atomic Design, com sistema de template cards e filtros avançados.

## Estrutura Atomic Design

### 1. **Atoms** (Elementos básicos)
```
frontend/src/components/atoms/
├── Button/
│   ├── Button.tsx (variants: primary, secondary, ghost, tab)
│   ├── Button.css
│   ├── Button.test.tsx
│   └── Button.stories.tsx
├── Input/
│   ├── SearchInput.tsx
│   ├── TextInput.tsx
│   ├── TextArea.tsx
│   ├── Input.css
│   └── Input.test.tsx
├── Badge/
│   ├── Badge.tsx (para tags e categorias)
│   ├── Badge.css
│   └── Badge.test.tsx
├── Typography/
│   ├── Heading.tsx
│   ├── Text.tsx
│   ├── Typography.css
│   └── Typography.test.tsx
├── Icon/
│   ├── Icon.tsx
│   ├── icons/ (SVGs)
│   └── Icon.test.tsx
└── Loading/
    ├── Spinner.tsx
    ├── LoadingDots.tsx
    ├── Loading.css
    └── Loading.test.tsx
```

### 2. **Molecules** (Combinações de atoms)
```
frontend/src/components/molecules/
├── SearchBar/
│   ├── SearchBar.tsx (SearchInput + Icon)
│   ├── SearchBar.css
│   └── SearchBar.test.tsx
├── FilterDropdown/
│   ├── FilterDropdown.tsx (Button + List)
│   ├── FilterDropdown.css
│   └── FilterDropdown.test.tsx
├── TagFilter/
│   ├── TagFilter.tsx (múltiplos Badge)
│   ├── TagFilter.css
│   └── TagFilter.test.tsx
├── TemplateCard/
│   ├── TemplateCard.tsx
│   ├── TemplateCard.css
│   └── TemplateCard.test.tsx
├── ModeTab/
│   ├── ModeTab.tsx (Button variant)
│   ├── ModeTab.css
│   └── ModeTab.test.tsx
└── MessageBubble/
    ├── MessageBubble.tsx (refatorar atual)
    ├── MessageBubble.css
    └── MessageBubble.test.tsx
```

### 3. **Organisms** (Seções complexas)
```
frontend/src/components/organisms/
├── ModeSelector/
│   ├── ModeSelector.tsx (múltiplos ModeTab)
│   ├── ModeSelector.css
│   └── ModeSelector.test.tsx
├── TemplateFilters/
│   ├── TemplateFilters.tsx (SearchBar + FilterDropdown + TagFilter)
│   ├── TemplateFilters.css
│   └── TemplateFilters.test.tsx
├── TemplateGrid/
│   ├── TemplateGrid.tsx (grid de TemplateCard)
│   ├── TemplateGrid.css
│   └── TemplateGrid.test.tsx
├── ChatArea/
│   ├── ChatArea.tsx (múltiplos MessageBubble)
│   ├── ChatArea.css
│   └── ChatArea.test.tsx
├── ChatControls/
│   ├── ChatControls.tsx (model selector + clear button)
│   ├── ChatControls.css
│   └── ChatControls.test.tsx
└── Header/
    ├── AppHeader.tsx
    ├── AppHeader.css
    └── AppHeader.test.tsx
```

### 4. **Templates** (Layouts de página)
```
frontend/src/components/templates/
├── FreeConversationTemplate/
│   ├── FreeConversationTemplate.tsx
│   ├── FreeConversationTemplate.css
│   └── FreeConversationTemplate.test.tsx
├── TemplateSelectionTemplate/
│   ├── TemplateSelectionTemplate.tsx
│   ├── TemplateSelectionTemplate.css
│   └── TemplateSelectionTemplate.test.tsx
└── ChatTemplate/
    ├── ChatTemplate.tsx (layout comum)
    ├── ChatTemplate.css
    └── ChatTemplate.test.tsx
```

### 5. **Pages** (Páginas completas)
```
frontend/src/pages/
├── HomePage/
│   ├── HomePage.tsx
│   ├── HomePage.css
│   └── HomePage.test.tsx
├── FreeConversationPage/
│   ├── FreeConversationPage.tsx
│   ├── FreeConversationPage.css
│   └── FreeConversationPage.test.tsx
└── TemplatePage/
    ├── TemplatePage.tsx
    ├── TemplatePage.css
    └── TemplatePage.test.tsx
```

## Design System

### Tokens de Design
```
frontend/src/design-system/
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   └── breakpoints.css
├── themes/
│   ├── light.css
│   └── dark.css (futuro)
└── utilities/
    ├── responsive.css
    └── animations.css
```

## Funcionalidades dos Filtros

### SearchBar Molecule
- Busca instantânea por nome de template
- Debounce de 300ms para performance
- Clear button integrado
- Placeholder inteligente baseado no contexto

### FilterDropdown Molecule
- Filtro por categoria (Educação, Criatividade, Desenvolvimento, etc.)
- Multi-select com checkbox
- Contador de itens selecionados
- Clear option individual

### TagFilter Molecule
- Tags clicáveis com visual feedback
- Estado selected/unselected
- Limite de tags visíveis com "show more"
- Quick filters para tags populares

### Combinação de Filtros
- Todos os filtros funcionam simultaneamente
- Estado persistente durante navegação
- Reset geral de todos os filtros
- Indicador de filtros ativos

## Hooks Personalizados

```
frontend/src/hooks/
├── useTemplateFilters.ts (lógica de filtros)
├── useTemplateSearch.ts (busca e debounce)
├── useModeSwitch.ts (troca entre modos)
├── useResponsiveGrid.ts (grid responsivo)
└── __tests__/
    ├── useTemplateFilters.test.ts
    ├── useTemplateSearch.test.ts
    ├── useModeSwitch.test.ts
    └── useResponsiveGrid.test.ts
```

## Implementação por Fases

### **Fase 1: Design System e Atoms**
- [ ] Configurar estrutura de pastas Atomic Design
- [ ] Criar tokens de design (cores, espaçamento, tipografia)
- [ ] Implementar atoms básicos (Button, Input, Badge, Typography, Icon, Loading)
- [ ] Configurar Storybook para documentação
- [ ] Testes unitários para todos os atoms
- [ ] Validar acessibilidade dos atoms

### **Fase 2: Molecules**
- [ ] Implementar SearchBar (busca com debounce)
- [ ] Criar FilterDropdown (multi-select)
- [ ] Desenvolver TagFilter (seleção múltipla)
- [ ] Construir TemplateCard (preview de template)
- [ ] Criar ModeTab (navegação entre modos)
- [ ] Refatorar MessageBubble (atual para atomic)
- [ ] Testes unitários para molecules
- [ ] Integração com design system

### **Fase 3: Organisms**
- [ ] Implementar ModeSelector (abas de modo)
- [ ] Criar TemplateFilters (barra completa de filtros)
- [ ] Desenvolver TemplateGrid (grid responsivo)
- [ ] Refatorar ChatArea (área de mensagens)
- [ ] Criar ChatControls (controles do chat)
- [ ] Implementar AppHeader
- [ ] Testes unitários para organisms
- [ ] Hooks personalizados

### **Fase 4: Templates e Pages**
- [ ] Criar templates de layout
- [ ] Implementar FreeConversationPage
- [ ] Desenvolver TemplatePage
- [ ] Atualizar roteamento (App.tsx)
- [ ] Integração completa dos modos
- [ ] Testes unitários para templates/pages

### **Fase 5: Testes e Finalização**
- [ ] Testes E2E completos (Playwright)
- [ ] Validação de responsividade (mobile/desktop)
- [ ] Teste de acessibilidade (WCAG)
- [ ] Otimização de performance
- [ ] Documentação atualizada
- [ ] Review final de código

## Testes Obrigatórios

### **Testes Unitários (Jest + React Testing Library)**

#### Cobertura Mínima:
- **Atoms**: 95% (componentes simples)
- **Molecules**: 90% (interações básicas)
- **Organisms**: 85% (lógica complexa)
- **Templates/Pages**: 80% (integração completa)

#### Casos de Teste por Componente:

**Button Atom:**
- Renderização com diferentes variants
- Handling de eventos (onClick, onKeyDown)
- Estados (loading, disabled)
- Acessibilidade (ARIA labels, keyboard navigation)

**SearchBar Molecule:**
- Debounce functionality (300ms)
- Clear button functionality
- onChange events
- Placeholder behavior

**TemplateCard Molecule:**
- Renderização com diferentes templates
- Click events para seleção
- Badge rendering para tags
- Responsive behavior

**TemplateFilters Organism:**
- Combinação de múltiplos filtros
- Reset functionality
- State persistence
- Filter interactions

**TemplateGrid Organism:**
- Responsive grid layout
- Empty states
- Loading states
- Filter integration

### **Testes Funcionais (Playwright E2E)**

```typescript
// e2e/template-interface.spec.ts
describe('Template Interface', () => {
  test('Navegação entre modos', async ({ page }) => {
    // Testar troca entre "Conversa Livre" e "Templates"
  });

  test('Filtros de templates funcionais', async ({ page }) => {
    // Testar busca por nome
    // Testar filtro por categoria
    // Testar filtro por tags
    // Testar combinação de filtros
    // Testar reset de filtros
  });

  test('Seleção e uso de templates', async ({ page }) => {
    // Testar seleção de template
    // Testar preenchimento de parâmetros
    // Testar início de conversa com template
  });

  test('Responsividade mobile/desktop', async ({ page }) => {
    // Testar layout em diferentes viewports
    // Testar navegação touch
  });

  test('Persistência de estado', async ({ page }) => {
    // Testar manutenção de filtros
    // Testar manutenção de modo selecionado
  });
});
```

## Critérios de Conclusão

### Funcionalidades Implementadas:
- [ ] Dois modos funcionais ("Conversa Livre" e "Templates")
- [ ] Sistema de template cards visualmente atrativo
- [ ] Filtros por nome, categoria e tags
- [ ] Navegação fluida entre modos
- [ ] Responsividade mobile/desktop
- [ ] Acessibilidade (WCAG 2.1 AA)

### Qualidade de Código:
- [ ] Estrutura Atomic Design completa
- [ ] Design system consistente
- [ ] Testes unitários > 85% cobertura
- [ ] Testes E2E passando 100%
- [ ] ESLint sem warnings
- [ ] TypeScript sem erros
- [ ] Performance otimizada

### Documentação:
- [ ] Storybook atualizado
- [ ] README com instruções
- [ ] Comentários JSDoc where necessary
- [ ] Changelog atualizado

## Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev

# Testes unitários
npm run test:frontend
npm run test:coverage

# Testes E2E
npm run test:e2e
npm run test:e2e:ui

# Storybook
npm run storybook

# Qualidade completa
npm run quality
```

## Riscos e Mitigações

### Riscos Identificados:
1. **Complexidade da migração**: Muitos componentes para refatorar
   - **Mitigação**: Implementação faseada e incremental

2. **Performance**: Muitos componentes pequenos
   - **Mitigação**: Lazy loading e React.memo otimizações

3. **Testes**: Grande volume de testes para implementar
   - **Mitigação**: Testes paralelos à implementação

4. **Responsividade**: Layout complexo em múltiplos dispositivos
   - **Mitigação**: Design system mobile-first

## Mensagem de Commit Final

```
feat: implementar interface com dois modos usando atomic design

- Reestruturar componentes seguindo atomic design principles
- Adicionar modo "Conversa Livre" e modo "Templates"  
- Criar sistema de template cards com filtros avançados
- Implementar design system com tokens reutilizáveis
- Adicionar cobertura completa de testes unitários e E2E
- Otimizar responsividade e acessibilidade
```

## Próximos Passos após Conclusão

1. Mover este arquivo para `done-interface-dois-modos-atomic-design.md`
2. Atualizar documentação principal do projeto
3. Criar guias de contribuição para novos componentes
4. Planejar implementação de modo escuro (theme system)
5. Considerar internacionalização dos novos componentes