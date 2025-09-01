# TODO: Reorganização das Cores da Interface com Wildtech + Dark Mode

## Objetivo
Implementar as cores da Wildtech (laranja #ff7b00 e marrom #8b4513) na interface, criar um sistema de dark mode e usar máximo de branco como fundo no light mode.

## Status
**INICIADO**: 01/09/2025

## Análise da Situação Atual
- **Cores atuais**: Sistema com azul como primário (#0ea5e9) e neutros em cinza
- **Problema**: Cores não refletem a identidade visual da Wildtech
- **Necessidade**: Implementar laranja (#ff7b00) e marrom (#8b4513) + dark mode

## Filosofia de Design
- **Light mode**: Máximo de branco como fundo (clean e minimalista)
- **Dark mode**: Inversão natural dos fundos brancos
- **Cores Wildtech**: Apenas para elementos interativos e destaques

## Mudanças Planejadas

### 1. Design System (colors.css)
```css
:root {
  /* Wildtech Brand Colors */
  --color-wildtech-orange: #ff7b00;
  --color-wildtech-orange-hover: #e66b00;
  --color-wildtech-orange-active: #cc5f00;
  --color-wildtech-brown: #8b4513;
  --color-wildtech-brown-hover: #7a3c0f;
  --color-wildtech-brown-active: #693309;
  
  /* Light theme - Maximum White */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #ffffff; 
  --color-bg-card: #ffffff;
  --color-bg-overlay: rgba(0, 0, 0, 0.5);
  
  /* Interactive Colors - Wildtech */
  --color-interactive-primary: var(--color-wildtech-orange);
  --color-interactive-primary-hover: var(--color-wildtech-orange-hover);
  --color-interactive-primary-active: var(--color-wildtech-orange-active);
  
  --color-interactive-secondary: var(--color-wildtech-brown);
  --color-interactive-secondary-hover: var(--color-wildtech-brown-hover);
  --color-interactive-secondary-active: var(--color-wildtech-brown-active);
  
  /* Focus and borders */
  --color-border-focus: var(--color-wildtech-orange);
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg-primary: #111111;
  --color-bg-secondary: #1a1a1a;
  --color-bg-tertiary: #222222;
  --color-bg-card: #222222;
  --color-bg-overlay: rgba(255, 255, 255, 0.1);
  
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #b0b0b0;
  --color-text-tertiary: #888888;
  --color-text-inverse: #111111;
  
  --color-border-primary: #333333;
  --color-border-secondary: #444444;
}
```

### 2. Hook Dark Mode (useDarkMode.ts)
- Controle de tema via localStorage
- Toggle entre light/dark
- Aplicação via data-theme attribute
- Sincronização com preferência do sistema

### 3. Componente ThemeToggle
- Botão discreto no header
- Ícone sol/lua
- Transição suave entre temas
- Acessibilidade completa

### 4. Componentes Atualizados

#### Button.css
- Primary: Laranja Wildtech
- Secondary: Marrom Wildtech
- Ghost/Tab: Manter neutros com hover Wildtech

#### FreeConversationPage
- Background: Branco puro mantido
- Ícone principal: Laranja com fundo branco
- Botão "Iniciar Conversa": Laranja primário
- Botão "Explorar Templates": Marrom secundário
- Features: Ícones com cores Wildtech

#### TemplatePage
- Background: Branco puro
- Cards: Fundo branco, hover com border laranja
- Filtros: Focus laranja
- Tags: Harmonia com nova paleta

#### Chat Interface
- Background: Branco puro (light) / Escuro (dark)
- Mensagens: Mínimo de cores de fundo
- Inputs: Fundo branco com borders Wildtech
- Botões: Primary laranja, secondary marrom

## Implementação Técnica

### Arquivos a Modificar
1. `frontend/src/design-system/tokens/colors.css`
2. `frontend/src/hooks/useDarkMode.ts` (novo)
3. `frontend/src/components/atoms/ThemeToggle/` (novo)
4. `frontend/src/components/atoms/Button/Button.css`
5. `frontend/src/pages/FreeConversationPage/FreeConversationPage.css`
6. `frontend/src/pages/TemplatePage/TemplatePage.css`
7. `frontend/src/components/Chat.css`
8. `frontend/src/components/templates/ChatTemplate/ChatTemplate.tsx`

### Fluxo de Validação
1. Implementar todas as mudanças
2. Testar ambos os temas (light/dark)
3. Executar validações:
   - `npm run test` (testes unitários)
   - `npm run test:e2e` (testes funcionais)
   - `npm run lint:fix` (corrigir lint automaticamente)
   - `npm run lint` (verificar problemas restantes)
   - `npm run type-check` (validações TypeScript)
4. Corrigir problemas encontrados
5. Commit: `feat: implementar cores Wildtech com dark mode. Closes #18`

## Resultados Esperados
- Interface com identidade visual Wildtech
- Dark mode funcional e elegante
- Light mode com máximo de branco
- Testes passando 100%
- Código limpo e sem warnings

## Critérios de Aceitação
- [ ] Cores Wildtech implementadas corretamente
- [ ] Dark mode funcionando perfeitamente
- [ ] Light mode com fundos brancos
- [ ] Transições suaves entre temas
- [ ] Todos os testes passando
- [ ] Lint sem erros
- [ ] TypeScript sem erros
- [ ] Acessibilidade mantida
- [ ] Responsividade preservada

---
**Issue**: #18
**Commit planejado**: `feat: implementar cores Wildtech com dark mode. Closes #18`