# Plano: Implementar Scripts de Pré-Commit com Conventional Commits

## 🎯 Objetivo
Implementar scripts de pré-commit para garantir que as mensagens de commit sigam o padrão Conventional Commits e executar verificações de qualidade antes de cada commit.

## 📋 Análise Atual
- **Git Hooks**: Apenas samples padrão, nenhum hook personalizado ativo
- **Scripts existentes**: npm quality, lint, test, type-check já implementados
- **Estrutura**: Projeto monorepo com frontend + backend
- **Ferramentas**: ESLint, TypeScript, Jest, Playwright já configurados

## 🛠 Implementação

### 1. Instalar Ferramentas de Commit
**Pacotes instalados:**
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky lint-staged
```

### 2. Configurar Commitlint
**Arquivo**: `commitlint.config.js` - Validação de mensagens de commit

### 3. Configurar Husky (Git Hooks)
- Hook `commit-msg`: Valida mensagem de commit
- Hook `pre-commit`: Executa verificações de código

### 4. Configurar Lint-Staged
**Arquivo**: `lint-staged.config.js` - Scripts para arquivos modificados

### 5. Scripts NPM Adicionados
- `prepare`: husky
- `pre-commit`: lint-staged
- `validate-commit`: commitlint

## 📝 Tipos de Commit Permitidos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `build`: Sistema de build
- `ci`: CI/CD
- `chore`: Manutenção
- `perf`: Performance
- `revert`: Reverter commit

## 📋 Checklist de Implementação
- [x] Instalar dependências
- [x] Criar `commitlint.config.js`
- [x] Inicializar Husky
- [x] Criar hooks
- [x] Configurar `lint-staged.config.js`
- [x] Atualizar scripts
- [ ] Testar sistema
- [ ] Renomear arquivo para `done-prd-commit-messages.md`

## 🏁 Commit Final
```
build: adicionar hooks pré-commit com validação de mensagens convencionais
```